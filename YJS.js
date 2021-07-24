// jshint esversion: 6
// @ts-check

import * as THREE from "https://unpkg.com/three@0.119.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.119.0/examples/jsm/controls/OrbitControls.js";

// #region Text Manipulation Page
/**
 * Read the file (text or image) and put into the field s
 * @param {any} event File event
 * @param {string} s Field name to put the text or image in 
 * @returns {any}
 */
export function read_file(event, s = "") {
    let input = event.target;
    let reader = new FileReader();
    reader.onload = function () {
        set_str(String(reader.result), s);
    };
    let output = get_elem_type(get_elem(s));
    if (starts_with(output, "img")) reader.readAsDataURL(input.files[0]);
    else if (starts_with(output, "text")) reader.readAsText(input.files[0]);
}

/**
 * Download the image in the canvas element s
 * @param {string} s The name of the canvas element
 * @param {string} file The filename
 * @returns {any}
 */
export function download_image(s = "", file = s) {
    let downloadLink = document.createElement('a');
    downloadLink.download = file_name(file, ".png");
    let canvas = get_elem(s);
    canvas.toBlob(function (blob) {
        let url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.click();
    });
}

/**
 * Download the file with name file with s in the file
 * @param {string} s The text to put in the file
 * @param {string} file The file name
 * @param {string} remove The strings to remove, separated by ;;
 * @returns {any}
 */
export function download_file(s = "", file = s, remove = "<br>") {
    let filename = file_name(get_str(file), ".txt");
    let text = get_str(s);
    let split = remove.split(";;");
    split.forEach(sp => text = str_replace(text, sp, ""));
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

/**
 * Submit to Google Form
 * @param {string} s Form name
 * @param {string} script Script URL
 * @param {string} message Output field
 * @param {string} check Confirm
 * @param {string} confirm Captcha
 * @returns {any} 
 */
export function submit_file(s = "", script = "", message = "", check = "", confirm = "") {
    let form = document.forms[s];
    form.addEventListener('submit', e => {
        e.preventDefault();
        let checkbox = get_elem(check);
        let captcha = get_str(confirm, "yes", true);
        let exist = get_str(message, "", true);
        if (!exist && captcha && (!checkbox || checkbox.checked)) {
            fetch(script, { method: 'POST', body: new FormData(form) })
                .then(() => set_str("Successful submission.", message))
                .catch(error => set_str("Error submission: " + error.message, message));
            checkbox.checked = false;
        }
        else if (exist) set_str("Error submission: already submitted once, to submit again, please click the Grade button first.", message);
        else if (!captcha) set_str("Error submission: missing ID.", message);
        else if (checkbox && (!checkbox.checked)) set_str("Error submission: please check the checkbox to confirm the submission.", message);
    });
}

/**
 * Text to speech
 * @param {string} text The text to speak
 * @param {number} voice Index of the voice
 * @returns {any}
 */
export function to_speech(text = "Hello World!", voice = 1) {
    let msg = new SpeechSynthesisUtterance();
    let voices = window.speechSynthesis.getVoices();
    msg.voice = voices[get_num(voice, 1)];
    msg.text = get_str(text);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
}

/**
 * Download the file with name file with s in the file
 * @param {string} file The file name
 * @param {string} s The text to put in the file
 * @returns {any}
 */
export function download_blanks(s = "", file = s) {
    let list = s.split(";");
    let str = list.reduce((s, i) => s + "\n" + field_name(i) + "\n" + get_str(i), "Outputs:");
    download_file(str, file);
}

/**
 * Select the text field
 * @param {string} s Field name
 * @returns {any}
 */
export function select_field(s = "") {
    let f = get_elem(s);
    if (f) f.select();
}

/**
 * Assign button function to the field when enter key is hit
 * @param {string} field Field id
 * @param {string} button Button id
 */
export function enter_button(field = "", button = "") {
    let text = get_elem(field);
    let but = get_elem(button);
    let type = get_type(field);
    if (text && but) {
        text.addEventListener("keydown", function (event) {
            if (event.keyCode === 13 && (starts_with(type, "input") || event.ctrlKey)) {
                event.preventDefault();
                but.click();
            }
        });
    }
}

/**
 * Make sure file is a file name with extension ext
 * @param {string} file File name
 * @param {string} ext Extension (include the .)
 * @returns {any}
 */
export function file_name(file = "", ext = ".txt") {
    if (ext == "") return file_name(file, ".txt");
    else if (!ext.startsWith(".")) return file_name(file, "." + ext);
    else if (file == "") return "text" + ext;
    else if (file.endsWith(ext)) return file;
    else return file + ext;
}

/**
 * Make sure field is a field name starting with @
 * @param {string} field Field name
 * @param {boolean} add Whether to add @ or remove @
 * @returns {any}
 */
export function field_name(field = "", add = true) {
    field = String(field);
    if (add) {
        if (field == "") return "@canvas";
        else if (field.startsWith("@")) return field;
        else return "@" + field;
    }
    else {
        if (field == "") return "canvas";
        else if (field.startsWith("@")) return field.substring(1);
        else return field;
    }
}

/**
 * Expand all details tags
 */
export function expand_all() {
    let list = document.getElementsByTagName("details");
    for (let i = 0; i < list.length; i++) list[i].setAttribute("open", "true");
}

/**
 * Add prefix to each line of input
 * @param {string} input Input field name
 * @param {string} prefix Prefix field name
 * @returns {any}
 */
export function add_to_start_page(input = "", prefix = "") {
    let inp = get_str(field_name(input));
    let pref = get_str(prefix);
    let output = add_to_start(inp, pref, false);
    set_str(output, field_name(input));
}

/**
 * Remove prefix to each line of input
 * @param {string} input Input field name
 * @param {string} prefix Prefix field name
 * @returns {any}
 */
export function remove_from_start_page(input = "", prefix = "") {
    let inp = get_str(field_name(input));
    let pref = get_str(prefix);
    let output = add_to_start(inp, pref, true);
    set_str(output, field_name(input));
}

/**
 * Add suffix to each line of input
 * @param {string} input Input field name
 * @param {string} suffix Suffix or field name
 * @returns {any}
 */
export function add_to_end_page(input = "", suffix = "") {
    let inp = get_str(field_name(input));
    let suf = get_str(suffix);
    let output = add_to_end(inp, suf, false);
    set_str(output, field_name(input));
}

/**
 * Remove suffix to each line of input
 * @param {string} input Input field name
 * @param {string} suffix Suffix or field name
 * @returns {any}
 */
export function remove_from_end_page(input = "", suffix = "") {
    let inp = get_str(field_name(input));
    let suf = get_str(suffix);
    let output = add_to_end(inp, suf, true);
    set_str(output, field_name(input));
}

/**
 * Remove lines containing the key
 * @param {string} input Input field name
 * @param {string} key Key or field name
 * @returns {any}
 */
export function remove_lines_contain_page(input = "", key = "") {
    let inp = get_str(field_name(input));
    let k = get_str(key);
    let output = keep_lines(inp, k, false);
    set_str(output, field_name(input));
}

/**
 * Remove lines not containing the key
 * @param {string} input Input field name
 * @param {string} key Key or field name
 * @returns {any}
 */
export function keep_lines_contain_page(input = "", key = "") {
    let inp = get_str(field_name(input));
    let k = get_str(key);
    let output = keep_lines(inp, k, true);
    set_str(output, field_name(input));
}

/**
 * Replace from by tto in the string input
 * @param {string} input Input field name
 * @param {string} from The string to be replaced or field name
 * @param {string} tto The string replacing it or field name
 * @param {string} incr The replacing string increase by incr each time
 * @param {string} every Increment every every time
 * @param {string} pre Add to the beginning of the strings
 * @param {string} post Add to the end of the strings
 * @returns {any}
 */
export function replace_page(input = "", from = "", tto = "", incr = "*", every = "1", pre = "", post = "") {
    let inp = get_str(field_name(input));
    let fro = get_str(from);
    let ttt = get_str(tto);
    let byy = get_str(incr);
    let eve = get_num(every);
    if (pre != "" || post != "") {
        fro = fro.split(",,").map(f => get_str(pre) + f + get_str(post));
        ttt = ttt.split(",,").map(t => get_str(pre) + t + get_str(post));
    }
    else {
        fro = fro.split(",,");
        ttt = ttt.split(",,");
    }
    let output = "";
    if (byy == "*") {
        if (fro.length > 1) output = str_replace_vec(inp, fro, ttt);
        else output = str_replace(inp, fro.join(",,"), ttt);
    }
    else output = str_replace_seq(inp, fro[0], Number(ttt[0]), Number(byy), eve);
    set_str(output, field_name(input));
}

/**
 * Replace from by tto in the string input
 * @param {string} input Input field name
 * @param {string} times Number of times to repeat
 * @returns {any}
 */
export function repeat_lines_page(input = "", times = "2") {
    let inp = get_str(field_name(input));
    let ttt = get_num(times, 2);
    let output = rep(inp.trim(), ttt).join("\n");
    set_str(output, field_name(input));
}

export function plot_image_page(input = "", output = "", nx = "2", ny = "2") {
    let mat;
    let text = get_str(input, "0").trim();
    if (text.includes("\n")) mat = str_to_mat_line(text, false);
    else mat = reshape(str_to_vec(text, false), get_num(nx, 1), get_num(ny, 1));
    let max = mat_max(mat);
    let min = mat_min(mat);
    mat = scale_mat_by_col(mat, [min, max], [0, 1]);
    let objects = [{ type: "grid", cts: true, mat: mat, x0: 0, y0: 0, x1: 1, y1: 1, c0: "grey" }];
    scale_bounding_box_to_canvas(objects, output, 0);
    two_paint(output, objects);
}

/**
 * Remove or keep lines containing the key
 * @param {string} input Input field name
 * @param {string} key Key or field name
 * @param {boolean} keep Whether to keep or remove lines with key
 * @returns {any}
 */
export function keep_lines(input = "", key = "", keep = true) {
    let list = input.split("\n");
    let output = "";
    if (keep) output = list.reduce((s, i) => i.indexOf(key) >= 0 ? s + i + "\n" : s, "");
    else output = list.reduce((s, i) => i.indexOf(key) < 0 ? s + i + "\n" : s, "");
    return output.substring(0, output.length - 1);
}

/**
 * Add or remove prefix to input
 * @param {string} input Input field name
 * @param {string} prefix Prefix or field name
 * @param {boolean} cut Whether to remove or add
 * @returns {any}
 */
export function add_to_start(input = "", prefix = "", cut = false) {
    let list = input.split("\n");
    let output = "";
    if (cut) output = list.reduce((s, i) => i.startsWith(prefix) ? s + i.substring(prefix.length) + "\n" : s + i + "\n", "");
    else output = list.reduce((s, i) => s + prefix + i + "\n", "");
    return output.substring(0, output.length - 1);
}

/**
 * Add or remove suffix to input
 * @param {string} input Input field name
 * @param {string} suffix Suffix or field name
 * @param {boolean} cut Whether to remove or add
 * @returns {any}
 */
export function add_to_end(input = "", suffix = "", cut = false) {
    let list = input.split("\n");
    let output = "";
    if (cut) output = list.reduce((s, i) => i.endsWith(suffix) ? s + i.substring(0, i.length - suffix.length) + "\n" : s + i + "\n", "");
    else output = list.reduce((s, i) => s + i + suffix + "\n", "");
    return output.substring(0, output.length - 1);
}

/**
 * Replace from by tto in the string input
 * @param {string} input Input field name
 * @param {string} from The string to be replaced or field name
 * @param {string|string[]} tto The string replacing it or field name
 * @returns {any}
 */
export function str_replace(input = "", from = "", tto = [""]) {
    let list = input.split(from);
    let n = tto.length;
    if (!Array.isArray(tto)) tto = [tto];
    let output = list.reduce((s, c, i) => (i > 0 ? s + (tto[(i - 1) % n] || "") + c : s + c), "");
    return output;
}

/**
 * Replace from by tto in the string input
 * @param {string} input Input field name
 * @param {string[]} from The string to be replaced or field name
 * @param {string[]} tto The string replacing it or field name
 * @returns {any}
 */
export function str_replace_vec(input = "", from = [""], tto = [""]) {
    let n = tto.length;
    let code = "!@#$%^&*";
    let output = input;
    for (let i in from) output = str_replace(output, from[i], [code + (Number(i) % n)]);
    for (let i in tto) { output = str_replace(output, code + i, [tto[i]]); }
    return output;
}

/**
 * Replace from by tto in the string input
 * @param {string} input Input field name
 * @param {string} from The string to be replaced or field name
 * @param {number} tto The starting number replacing it or field name
 * @param {number} byy The increment of the number
 * @param {number} eve Increment every eve times
 * @returns {any}
 */
export function str_replace_seq(input = "", from = "", tto = 1, byy = 1, eve = 1) {
    let list = input.split(from);
    let every = Math.floor(Math.abs(eve));
    let output = list.reduce((s, c, i) => i > 0 ? s + (tto + byy * (Math.floor((i - 1) / every))) + c : s + c, "");
    return output;
}

/**
 * Copy or cut to clipboard
 * @param {string} field Input field
 * @param {string} action Either copy or cut or paste
 * @returns {any}
 */
export function clipboard(field = "", action = "copy") {
    let elem = get_elem(field_name(field));
    if (elem != null) {
        elem.select();
        elem.setSelectionRange(0, 99999);
        document.execCommand(action);
    }
}
// #endregion

export function w_to_line_bound(w = [0, 0, 0], bounds = { min_x: 0, min_y: 0, max_x: 1, max_y: 1 }) {
    return w_to_line(w, bounds.min_x, bounds.min_y, bounds.max_x, bounds.max_y);
}

export function w_to_line(w = [0, 0, 0], x0 = -1, y0 = -1, x1 = 1, y1 = 1) {
    return abc_to_line(w[0], w[1], w[2], x0, y0, x1, y1);
}

export function ab_to_line(a = 0, b = 0, x0 = -1, y0 = -1, x1 = 1, y1 = 1) {
    return abc_to_line(a, -1, b, x0, y0, x1, y1);
}

export function abc_to_line(a = 0, b = 0, c = 0, x0 = -1, y0 = -1, x1 = 1, y1 = 1) {
    if (x0 > x1 || y0 > y1) return abc_to_line(a, b, c, Math.min(x0, x1), Math.min(y0, y1), Math.max(x0, x1), Math.max(y0, y1));
    let yx0 = b == 0 ? Number.NEGATIVE_INFINITY : (a * x0 + c) / (-b);
    let xy0 = a == 0 ? Number.NEGATIVE_INFINITY : (b * y0 + c) / (-a);
    let yx1 = b == 0 ? Number.NEGATIVE_INFINITY : (a * x1 + c) / (-b);
    let xy1 = a == 0 ? Number.NEGATIVE_INFINITY : (b * y1 + c) / (-a);
    let list = [];
    if (y0 <= yx0 && y1 >= yx0) list.push(x0, yx0);
    if (y0 <= yx1 && y1 >= yx1) list.push(x1, yx1);
    if (x0 <= xy0 && x1 >= xy0) list.push(xy0, y0);
    if (x0 <= xy1 && x1 >= xy1) list.push(xy1, y1);
    return { type: "line", x0: list[0], y0: list[1], x1: list[2], y1: list[3], w: [a, b, c] };
}

/**
 * Reshape an array to a matrix
 * @param {any[]} list The list
 * @param {number} row The number of rows
 * @param {number} col The number of columns
 * @param {any} add Padding
 * @param {boolean} end Pad at the beginning or end
 * @returns {any}
 */
export function reshape(list = [], row = 1, col = Math.floor(list.length / row), add = 0, end = true) {
    let mat = [];
    let rows = row <= 0 ? 1 : row;
    let n = list.length;
    let columns = col <= 0 ? Math.floor(n / row) : col;
    let limit = Math.min(rows, Math.floor(n / columns));
    let pad = Math.max(0, rows * columns - n);
    let pad_limit = Math.floor(pad / columns);
    let pad_remain = Math.max(0, pad - pad_limit * columns);
    let remain = Math.max(0, n - limit * columns);
    if (!end && pad) {
        for (let i = 0; i < pad_limit; i++) mat.push(rep(add, columns));
        if (remain) mat.push([...rep(add, pad_remain), ...list.slice(0, remain)]);
    }
    for (let i = 0; i < limit; i++) mat.push(list.slice((!end ? remain : 0) + i * columns, (!end ? remain : 0) + (i + 1) * columns));
    if (end && pad) {
        if (remain) mat.push([...list.slice(n - remain, n), ...rep(add, pad_remain)]);
        for (let i = 0; i < pad_limit; i++) mat.push(rep(add, columns));
    }
    return mat;
}

/**
 * Sum up two matrices a * b + c * d
 * @param {number[][]} a The first matrix
 * @param {number[][]} b The second matrix
 * @param {number} c The first coefficient
 * @param {number} d The second coefficient
 * @returns {any}
 */
export function mat_add(a = [[0]], b = [[0]], c = 1, d = 1) {
    return a.map((ai, i) => vec_add(ai, b[i], c, d));
}

/**
 * Sum up two matrices a * b + c * d
 * @param {number[][]} a The first matrix
 * @param {number[]} b The second matrix
 * @param {number} c The first coefficient
 * @param {number} d The second coefficient
 * @returns {any}
 */
export function mat_add_vec_row(a = [[0]], b = [0], c = 1, d = 1) {
    return a.map(ai => vec_add(ai, b, c, d));
}

/**
 * Sum up two matrices a * b + c * d
 * @param {number[][]} a The first matrix
 * @param {number[]} b The second matrix
 * @param {number} c The first coefficient
 * @param {number} d The second coefficient
 * @returns {any}
 */
export function mat_add_vec_col(a = [[0]], b = [0], c = 1, d = 1) {
    let ones = rep(1, a.length);
    return a.map((ai, i) => vec_add(ai, ones, c, d * b[i]));
}


/**
 * Find the max in the matrix
 * @param {number[][]} a The matrix
 * @returns {any}
 */
export function mat_max(a = [[0]]) {
    return a.reduce((s, i) => Math.max(s, Math.max(...i)), get_ij(a, 0, 0));
}

/**
 * Find the min in the matrix
 * @param {number[][]} a The matrix
 * @returns {any}
 */
export function mat_min(a = [[0]]) {
    return a.reduce((s, i) => Math.min(s, Math.min(...i)), get_ij(a, 0, 0));
}

/**
 * Flatten a matrix
 * @param {any[][]} x The matrix
 * @return {any[]}
 */
export function flatten(x = [[0]]) {
    let list = [];
    x.forEach(xi => list.push(...xi));
    return list;
}

/**
 * Identity matrix 
 * @param {number} n Size
 * @returns {number[][]}
 */
export function id_mat(n = 0) {
    let mat = zero_mat(n, n, 0);
    for (let i = 0; i < n; i++) mat[i][i] = 1;
    return mat;
}

/**
 * Identity vector
 * @param {number} n Size
 * @param {number} i Position
 * @returns {number[]}
 */
export function id_vec(n = 0, i = 0) {
    let mat = zero_vec(n, 0);
    mat[i] = 1;
    return mat;
}

export function inv(x = [[1]]) {
    return numeric.inv(x);
}

export function solve(x = [[1]], b = [1]) {
    return numeric.solve(x, b);
}

export function det(x = [[0]]) {
    return numeric.det(x);
}

export function f_min(fun, df, init = [0]) {
    let z = [];
    let cb = function (i, x, f, g, H) { z.push({ i: i, x: x, f: f, g: g, H: H }) };
    let out = numeric.uncmin(fun, init, 1e-10, df, 100, cb);
    console.log(z);
    console.log(out);
    return cb.solution;
}

export function f_rose(x = [0]) {
    return x.reduce((s, xi, i) => i == x.length - 1 ? s : (s + 100 * (x[i + 1] - xi * xi) * (x[i + 1] - xi * xi) + (1 - xi) * (1 - xi)), 0);
}

export function df_rose(x = [0]) {
    let g = zero_vec(x.length);
    for (let i = 0; i < x.length - 1; i++) g[i] -= 400 * (x[i + 1] - x[i] * x[i]) * x[i] + 2 * (1 - x[i]);
    for (let i = 1; i < x.length; i++) g[i] += 200 * (x[i] - x[i - 1] * x[i - 1]);
    return g;
}

export function f_sphere(x = [0]) {
    return norm_sq(x, 2);
}

export function df_sphere(x = [0]) {
    return x.map(xi => 2 * xi);
}

/**
 * Return identity vector: [0, 1, 0, ...]
 * @param {number} n Size
 * @param {number} i Identity
 * @returns {number[]}
 */
export function vec_id(n = 1, i = 0) {
    let x = zero_vec(n, 0);
    if (is_index(i, x)) x[i] = 1;
    return x;
}

/**
 * Gradient of f at x
 * @param {function} f The function
 * @param {number[]} x The x
 * @param {number} eps dx
 * @returns {number[]}
 */
export function grad(f, x = [0], eps = 0.0001) {
    let fx = f(x);
    return x.map((_, i) => (f(vec_add(x, vec_id(x.length, i), 1, eps)) - fx) / eps);
}

/**
 * Check if the gradient function is close to the numerical gradient
 * @param {function} f The function
 * @param {function} df The gradient
 * @param {number[]} x The x
 * @param {number} eps dx
 * @returns 
 */
export function check_grad(f, df, x = [0], eps = 0.0001) {
    return vec_close(df(x), grad(f, x, eps), 4);
}

export function is_finite(x = [0]) {
    if (typeof x == "number") return isFinite(x);
    else if (Array.isArray(x)) return x.reduce((s, xi) => s && isFinite(xi), true);
}

export function optimize(f, df, init = [0], method = "BF-GS", search = "inexact", max_it = 100, eps = 0.0001, param = {}) {
    let x = init;
    if (method == "BF-GS") {
        param.b = id_mat(x.length);
        if (!df) df = xi => grad(f, xi, eps);
        param.dfx = df(x);
    }
    let f0 = f(x);
    let df0 = l_norm(param.dfx);
    for (let k = 0; k < max_it; k++) {
        let direction;
        if (method == "BF-GS") direction = vec_mul(mat_dot_vec_col(param.b, param.dfx), -1);
        let scale = line_search(f, x, direction, search);
        let xp = vec_add(x, direction, 1, scale);
        let stop = !is_finite(xp) || k == max_it - 1;
        if (!stop && method == "BF-GS") {
            let dfp = df(xp);
            if (l_norm(dfp) < eps) stop = true;
            else {
                let dfx = param.dfx;
                let y = vec_add(dfp, dfx, 1, -1);
                let s = vec_mul(direction, scale);
                let sy = vec_dot(s, y);
                if (sy != 0) {
                    let ss = vec_dot_vec(s, s);
                    let by = mat_dot_vec_col(param.b, y);
                    let yby = vec_dot(y, by);
                    let bys = vec_dot_vec(by, s);
                    let syb = vec_dot_vec(s, by);
                    param.dfx = dfp;
                    param.b = mat_add(param.b, mat_add(ss, mat_add(bys, syb), (sy + yby) / (sy * sy), - 1 / sy));
                }
                else stop = true;
            }
        }
        if (stop) return { x: x, f: f(x), df: l_norm(df(x)), x0: init, f0: f0, df0: df0, it: k };
        else x = xp;
    }
}

export function line_search(f, x = [0], p = [0], search = "inexact", param = { tau: 0.5, c: 0.5, a: 1 }) {
    let m = vec_dot(p, p);
    let c = param.c || 0.5;
    let tau = param.tau || 0.5;
    let a = param.a || 1;
    let t = - c * m;
    for (let i = 0; i < 10; i++) {
        if (f(x) - f(vec_add(x, p, 1, a)) >= a * t) return a;
        a = tau * a;
    }
    return a;
}

// Incorrect TODO
export function l_bf_gs(f, df, init = [0]) {
    let x = [init];
    let s = [zero_vec(x.length)];
    let g = [df(init)];
    let y = [zero_vec(x.length)];
    let rho = [1 / vec_dot(y, s)];
    let gam = [1];
    let h = id_mat(xp.length);
    for (let k = 1; k < 100; k++) {
        let q = g[k];
        let alpha = [];
        for (let i = k - 1; i >= k - m; i--) {
            alpha.push(rho[i] * vec_dot(s[i], q));
            q = vec_add(q, y[i], 1, - alpha[i]);
        }
        gam.push(vec_dot(s[k - 1], y[k - 1]) / vec_dot(y[k - 1], y[k - 1]));
        let h0 = mat_mul(id_mat(xp.length), gam[k]);
        let z = mat_dot_vec_col(h0, q);
        for (let i = k - m; i <= k - 1; i++) {
            beta.push(rho[i] * vec_dot(y[i][z]));
            z = vec_add(z, s[i], 1, alpha[i] - beta[i]);
        }
        z = vec_mul(z, -1);
        x.push(vec_add(x, z));
    }
    console.log(x);
}

export function soft_max_likelihood(x = [0], y = 0, w = [[0]]) {
    return activate_soft_max(x, w)[y];
}

export function linear_max_likelihood(x = [0], y = 0, w = [[0]]) {
    return activate_linear_max(x, w)[y];
}

export function train_soft_max(x = [[0]], y = [0], param = { w0: [0] }) {
    return bf_gs_mle(x, y, param.w0, soft_max_likelihood, param);
}

export function train_linear_max(x = [[0]], y = [0], param = { w0: [0] }) {
    return bf_gs_mle(x, y, param.w0, linear_max_likelihood, param);
}

export function prob_classify_soft_max(x = [0], w = { w: [0] }) {
    return activate_soft_max(x, w.w);
}

export function prob_classify_linear_max(x = [0], w = { w: [0] }) {
    return activate_linear_max(x, w.w);
}

export function int_to_cat(y = [0]) {
    let min = Math.floor(Math.min(...y));
    return y.map(yi => Math.floor(yi) - min);
}

/**
 * Count number of categories
 * @param {number[]|number[][]} y The values
 * @returns 
 */
export function n_cat(y = [0]) {
    if (is_mat(y)) return n_cat(y.map(yi => n_cat(yi)));
    else if (is_vec(y)) return Math.ceil(Math.max(...y)) + 1;
    else return 0;
}

export function bf_gs_mle(x = [[0]], y = [0], w0 = [0], likelihood = soft_max_likelihood, param = {}) {
    let m = x[0].length;
    let k = n_cat(y);
    if (!w0 || w0.length != (m + 1) * (k - 1)) w0 = zero_vec((m + 1) * (k - 1), 0);
    let f = function (w) {
        let wp = reshape(w, k, m + 1, 0, false);
        return x.reduce((s, xi, i) => s - Math.log(likelihood(xi, y[i], wp)), 0);
    };
    let df = w => grad(f, w);
    let sol = optimize(f, df, w0, "BF-GS", "inexact", param.max_it || 100, param.eps || 0.0001);
    return { w: reshape(sol.x, k, m + 1, 0, false), w0: reshape(w0, k, m + 1, 0, false), sol: sol };
}

export function ic_set() {
    let set = get_str("@dataset", "");
    let index = get_num("@index", 0);
    let x = [];
    let y = [];
    let w = [];
    let r0 = [ic_8240,
        ic_1341,
        ic_216,
        ic_4865,
        ic_5389,
        ic_7509,
        ic_8052,
        ic_9388,
        ic_120,
        ic_1436,
        ic_2604,
        ic_2720,
        ic_3957,
        ic_4144,
        ic_4204,
        ic_437,
        ic_4741,
        ic_6106,
        ic_7314,
        ic_9133,
        ic_9363,
        ic_1143,
        ic_1949,
        ic_2016,
        ic_2722,
        ic_2966,
        ic_3671,
        ic_4128,
        ic_4813,
        ic_5105,
        ic_5606,
        ic_5661,
        ic_5885,
        ic_6733,
        ic_8017,
        ic_8983
    ];
    let r1 = [];
    let r2 = [];
    if (starts_with(set, "1D")) {
        x = [[-0.53], [-0.51], [-0.51], [-0.51], [-0.49], [-0.49], [-0.49], [1], [1], [1]];
        y = [2, 1, 1, 1, 2, 2, 2, 3, 3, 3];
        w = [50.40985, 25.73034, 63.65515, 21.77434];
    }
    else if (starts_with(set, "Random")) {
        let data = r0[index];
        x = get_col(data, [1, 2]);
        y = get_col(data, 0);
        w = [0, 0, 0, 0, 0, 0];
    }
    else {
        x = [[-0.0100000, 0.3333333],
        [-0.0100000, 0.6666667],
        [-0.0100000, 1.0000000],
        [-0.2836751, -0.1753269],
        [-0.5723503, -0.3419936],
        [-0.8610254, -0.5086603],
        [0.2936751, -0.1580064],
        [0.5823503, -0.3246731],
        [0.8710254, -0.4913397],
        [0.0100000, 0.3333333],
        [0.0100000, 0.6666667],
        [0.0100000, 1.0000000],
        [-0.2936751, -0.1580064],
        [-0.5823503, -0.3246731],
        [-0.8710254, -0.4913397],
        [0.2836751, -0.1753269],
        [0.5723503, -0.3419936],
        [0.8610254, -0.5086603]];
        y = [1, 1, 1, 2, 1, 2, 3, 3, 3, 3, 3, 3, 1, 1, 1, 2, 2, 2];
        w = [104.9925, -181.3391914, -0.6053178, 209.419, 0.3656777, -0.2852057];
    }
    set_str(mat_to_str_line(col_bind(y, x)), "@data");
    set_str(vec_to_str_line(w), "@input");
}

/**
 * Read one parameter
 * @param {string} text The list of parameters
 * @param {string} param The parameter names
 * @param {string|number|boolean} def Default
 * @param {string} sep Text separator
 * @param {string} div Parameter separator
 * @returns {any}
 */
export function read_param(text = "", param = "", def = "", sep = ",", div = ",") {
    let list = text.split(sep).map(l => l.trim());
    let choice = param.split(div).map(p => p.trim());
    let item = list.find(l => starts_with(l, choice, true));
    if (item) {
        if (item.includes("=")) return item.substring(item.indexOf("=") + 1).trim();
        else if (item.includes(":")) return item.substring(item.indexOf(":") + 1).trim();
        else return item.substring(item.indexOf(" ") + 1).trim();
    }
    else return def;
}

/**
 * 
 * @param {number} i 
 * @param {number} a 
 * @param {number} b 
 * @param {number|number[]} x 
 * @param {number|number[]} y 
 * @returns {number}
 */
export function md_ml_loss(i = 0, a = 0, b = 0, x = 0, y = 0) {
    if (Array.isArray(x)) return x.reduce((s, xk, k) => s + md_ml_loss(i, a, b, xk, y[k]), 0);
    if (i == 0) {
        if (Math.abs(a + b) < 0.001) {
            if (y == 1) return Math.pow(Math.max(x + b, 0), 2);
            else if (y == 3) return Math.pow(Math.max(b - x, 0), 2);
            else return Math.pow(Math.max(Math.abs(x) - b, 0), 2);
        }
        else return 1000;
    }
    else if (i == 1) {
        let l0 = 0;
        if (y == 1) return Math.pow((a - 5) * 0.5 - x, 2) + l0;
        else if (y == 3) return Math.pow((b + 5) * 0.5 - x, 2) + l0;
        else return Math.pow((a + b) * 0.5 - x, 2) + l0;
    }
    else if (i == 2) {
        let sa = 0.25;
        let sb = 0.25;
        let ea = Math.exp(sa * x - sa * a);
        let eb = Math.exp(-sb * x + sb * b);
        let oe = 1 / (ea + eb + 1);
        if (y == 1) return ea * oe;
        else if (y == 3) return eb * oe;
        else return oe;
    }
}

export function md_ml_data(i = 0, j = 0) {
    let r1 = 1;
    let r2 = 1;
    if (i == 0 && j == 0) return ({ x: [-5, -3, -2, 4, 5], y: [1, 2, 1, 2, 3] });
    else if (i == 0 && j == 1) return ({ x: [-5, -3, -2, 4, 5], y: [1, 2, 3, 2, 3] });
    else if (i == 1 && j == 0) return ({ x: [-4, -3, -2, 3, 3, 3, 4], y: [1, 2, 1, 2, 2, 2, 3] });
    else if (i == 1 && j == 1) return ({ x: [-4, -3, -2, 3, 3, 3, 4], y: [1, 2, 3, 2, 2, 2, 3] });
    else if (i == 2 && j == 0) return ({ x: [-5, ...rep(-3, r1), -2, ...rep(4, r2), 5], y: [1, ...rep(2, r1), 1, ...rep(2, r2), 3] });
    else if (i == 2 && j == 1) return ({ x: [-5, ...rep(-3, r1), -2, ...rep(4, r2), 5], y: [1, ...rep(2, r1), 3, ...rep(2, r2), 3] });
}

export function md_ml_min(loss = (a, b) => 0, min = -4, max = 4, d = 1) {
    let m = { a: min, b: min, l: loss(min, min) };
    for (let a = min; a < max + d; a += d) {
        for (let b = a; b < max + d; b += d) {
            let l = loss(a, b);
            if (l < m.l) {
                m.l = l;
                m.a = a;
                m.b = b;
            }
        }
    }
    return m;
}

export function md_ml_1d() {
    let set = 2;
    let loss = 2;
    let dx = 0.01;
    let xy = md_ml_data(set);
    let x = xy.x;
    let y = xy.y;
    let xy1 = md_ml_data(set, 1);
    let x1 = xy1.x;
    let y1 = xy1.y;
    let min = Math.min(...x);
    let max = Math.max(...x);
    console.log(md_ml_loss(loss, -3, 3, x, y));
    console.log(md_ml_loss(loss, -3, 3, x1, y1));
    console.log(md_ml_loss(loss, -2, 2, x1, y1));
    console.log(md_ml_loss(loss, -1, 1, x1, y1));
    console.log(md_ml_loss(loss, -2.5, 4, x1, y1));
    console.log(md_ml_min((a, b) => md_ml_loss(loss, a, b, x, y), min, max, dx));
    console.log(md_ml_min((a, b) => md_ml_loss(loss, a, b, x1, y1), min, max, dx));
}

export function md_ml_test() {
    let set = get_str("@dataset", "");
    if (set != "Data") ic_set();
    let xy_data = get_str("@data", "");
    let w_data = get_str("@input", "");
    if (xy_data) {
        let xy = str_to_mat_line(xy_data);
        let n = xy.length;
        let m = xy[0].length - 1;
        let y_first = true;
        let x = get_col(xy, y_first ? seq(1, m, 1) : seq(0, m - 1, 1));
        let y = get_col(xy, y_first ? 0 : m).map(yi => yi - 1);
        let w0 = str_to_vec(w_data);
        let train = train_soft_max;
        let prob = prob_classify_soft_max;
        let max_it = get_num("@max_it", 100);
        let eps = get_num("@eps", 0.0001);
        let ic = check_incentive_xy(x, y, train, prob, { w0: w0, max_it: max_it, eps: eps });
        let lie = ic.list.length ? ic.list[0].i : -1;
        let shapes = rep("cir", n);
        let yp = vec_clone(y);
        if (lie >= 0) {
            shapes[lie] = "rect";
            yp[lie] = ic.list[0].jt;
        }
        let dn = get_num("@grid", 100);
        let bounds = to_bound(ext_by_col(x, 0), ext_by_col(x, 1));
        let grid = double_partition(bounds.min_x, bounds.max_x, dn, bounds.min_y, bounds.max_y, dn);
        let plot = (dn <= 0 ? [] : mat_to_grid(classify_mat(grid, ic.model, prob), bounds, "", [], ["red", "green", "blue"]));
        let highlight = (dn <= 0 ? [] : mat_to_grid(classify_mat(grid, (lie >= 0 ? ic.list[0].model : ic.model), prob), bounds, "", [], ["red", "green", "blue"]));
        let plot_data = mat_to_points(x, y, "", [], ["red", "green", "blue"], "circ", 0.08, "black");
        let highlight_data = mat_to_points(x, yp, "", [], ["red", "green", "blue"], shapes, 0.08, "black");
        plot.push(...plot_data);
        highlight.push(...highlight_data);
        scale_bounding_box_to_canvas(plot, "@plot_old", 5);
        scale_bounding_box_to_canvas(highlight, "@plot_new", 5);
        two_paint("plot_old", plot);
        two_paint("plot_new", highlight);
        set_str(ic.text.join("\n"), "@output");
        set_str(ic.detail + "\n" + (lie >= 0 ? ic.list[0].detail : ""), "@details");
    }
}

/**
 * Check whether the dataset is incentive compatible
 * @param {number[][]} x X 
 * @param {number[]} y Y 
 * @param {function} train Training method 
 * @param {function} prob_classify Classification method 
 * @param {object} param Parameters for training 
 * @returns {object}
 */
export function check_incentive_xy(x = [[]], y = [], train = train_soft_max, prob_classify = prob_classify_soft_max, param = { w0: [] }) {
    let model0 = train(x, y, param);
    let prob0 = classify_vec(x, model0, prob_classify);
    let k = Math.max(...y) + 1;
    let n = x.length;
    let list = [];
    let text = [];
    let detail0 = "Model0: #iterations: " + model0.sol.it + ", likelihood: " + model0.sol.f + ", gradient: " + model0.sol.df;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < k; j++) {
            let y0 = y[i];
            if (y0 != j) {
                y[i] = j;
                let model1 = train(x, y, param);
                let prob1 = prob_classify(x[i], model1);
                if (prob1[y0] > prob0[i][y0] + 0.0001) {
                    text.push(" * " + i + " " + j + " --> " + vec_to_str_line(prob0[i], 4) + " ~~~ " + vec_to_str_line(prob1, 4));
                    let detail1 = "Model1: #iterations: " + model1.sol.it + ", likelihood: " + model1.sol.f + ", gradient: " + model1.sol.df;
                    list.push({ model: model1, i: i, j: y0, jt: j, detail: detail1 });
                }
                else text.push(i + " " + j + " --> " + vec_to_str_line(prob0[i], 4) + " ~~~ " + vec_to_str_line(prob1, 4));
                y[i] = y0;
            }
        }
    }
    return { model: model0, list: list, text: text, detail: detail0 };
}

export function activate_soft_max(x = [0], w = [[0]]) {
    return soft_max(mat_dot_vec_row(w, x, 1));
}

export function activate_linear_max(x = [0], w = [[0]]) {
    return linear_max(mat_dot_vec_row(w, x, 1));
}

export function batch_gradient_soft_max(x = [[0]], y = [0], w = [[0]]) {
    return mat_mul(x.reduce((s, xi, i) => mat_add(s, gradient_soft_max(xi, y[i], w)), rep(0, w.length, w[0].length)), 1.0 / x.length);
}

export function gradient_soft_max(x = [0], y = 0, w = [[0]]) {
    let output = activate_soft_max(x, w);
    let db = vec_add(output, one_hot(y, w.length), 1, -1);
    let dw = vec_dot_vec(db, x);
    let gr = col_bind(dw, db);
    gr[0] = rep(0, gr[0].length);
    return gr;
}


/**
 * Find the number of element in an array (recursive)
 * @param {any} s List
 * @returns {number}
 */
export function n_elem(s = []) {
    if (is_vec(s)) return s.reduce((sum, si) => sum + n_elem(si), 0);
    else return 1;
}

/**
 * Find the number of rows in a matrix
 * @param {any[]} s List
 * @returns {number}
 */
export function n_row(s = []) {
    if (is_vec(s)) return s.length;
    else return 1;
}

/**
 * Find the number of cols in a matrix
 * @param {any[][]} s List
 * @returns {number}
 */
export function n_col(s = [[]], min = true) {
    if (is_vec(s)) {
        let rows = s.map(n_row);
        if (min) return Math.max(1, Math.min(...rows));
        else return Math.max(1, ...rows);
    }
    else return 1;
}

/**
 * Check if a is a vector
 * @param {any} a The object
 * @returns {a is any[]}
 */
export function is_vec(a = [0]) {
    return Array.isArray(a);
}

/**
 * Check if a is a matrix
 * @param {any} a The object
 * @param {boolean} fast Whether to check only the first row or each row
 * @returns {a is any[][]}
 */
export function is_mat(a = [[0]], fast = true) {
    if (fast) return is_vec(a) && is_vec(a[0]);
    else return is_vec(a) && a.reduce((s, ai) => s && is_vec(ai), true);
}

/**
 * Check if a is a matrix
 * @param {any} a The object
 * @param {boolean} fast Whether to check only the first row or each row
 * @returns {a is any[][][]}
 */
export function is_a3(a = [[[0]]], fast = true) {
    if (fast) return is_vec(a) && is_mat(a[0], true);
    else return is_vec(a) && a.reduce((s, ai) => s && is_mat(ai), true);
}

/**
 * Combine two matrices left and right
 * @param {any[][]|any[]|any} x The left matrix
 * @param {any[][]|any[]|any} y The right matrix
 * @returns {any}
 */
export function col_bind(x = [[0]], y = [[0]]) {
    if (is_mat(x)) {
        if (is_mat(y)) return x.map((xi, i) => [...xi, ...y[i]]);
        else if (is_vec(y)) return x.map((xi, i) => [...xi, y[i]]);
        else return col_bind(x, rep(y, x.length));
    }
    else if (is_vec(x)) {
        if (is_mat(y)) return x.map((xi, i) => [xi, ...y[i]]);
        else if (is_vec(y)) return x.map((xi, i) => [xi, y[i]]);
        else return col_bind(x, rep(y, x.length));
    }
    else {
        if (is_mat(y)) return col_bind(rep(x, y.length), y);
        else if (is_vec(y)) return col_bind(rep(x, y.length), y);
        else return [x, y];
    }
}

/**
 * Combine two matrices up and down
 * @param {any[][]|any[]|any} x The left matrix
 * @param {any[][]|any[]|any} y The right matrix
 * @returns {any}
 */
export function row_bind(x = [[0]], y = [[0]]) {
    if (is_mat(x)) {
        if (is_mat(y)) return [...x, ...y];
        else if (is_vec(y)) return [...x, y];
        else return row_bind(x, rep(y, x[0].length));
    }
    else if (is_vec(x)) {
        if (is_mat(y)) return [x, ...y];
        else if (is_vec(y)) return [x, y];
        else return row_bind(x, rep(y, x.length));
    }
    else {
        if (is_mat(y)) return row_bind(rep(x, y[0].length), y);
        else if (is_vec(y)) return row_bind(rep(x, y.length), y);
        else return [[x], [y]];
    }
}

/**
 * Outer product
 * @param {number[]} a First vector
 * @param {number[]} b Second vector (transposed)
 * @returns {any}
 */
export function vec_dot_vec(a = [0], b = [0]) {
    return a.map(ai => b.map(bi => ai * bi));
}

/**
 * Find the index of the maximum
 * @param {number[][]} x The array
 * @returns {any}
 */
export function arg_max_mat(x = [[0]]) {
    let ind = x.map(i => Math.max(...i));
    let i = arg_max(ind);
    let j = arg_max(x[i]);
    return [i, j];
}

/**
 * Find the index of the minimum
 * @param {number[][]} x The array
 * @returns {any}
 */
export function arg_min_mat(x = [[0]]) {
    let ind = x.map(i => Math.min(...i));
    let i = arg_min(ind);
    let j = arg_min(x[i]);
    return [i, j];
}

/**
 * Find the index of the maximum
 * @param {number[]} x The array
 * @returns {any}
 */
export function arg_max(x = [0]) {
    return x.reduce((iMax, s, i, arr) => s > arr[iMax] ? i : iMax, 0);
}

/**
 * Find the index of the minimum
 * @param {number[]} x The array
 * @returns {any}
 */
export function arg_min(x = [0]) {
    return x.reduce((iMax, s, i, arr) => s < arr[iMax] ? i : iMax, 0);
}

/**
 * Inner product a * b or (different length) [a ... d] * [b ... d]
 * @param {any[]} a First vector (transposed)
 * @param {any[]} b Second vector
 * @param {any} d Fill for shorter vector
 * @returns {any}
 */
export function vec_dot(a = [0], b = [0], d = 0) {
    if (d != 0 && a.length < b.length) return vec_dot(b, a, d);
    else if ((a.length > 1 && typeof a[0] == "number") || (b.length > 1 && typeof b[0] == "number")) {
        if (b.length > 1 && typeof b[0] != "number") return a.reduce((s, ai, i) => (ai > 0 && i < b.length) ? s + (s != "" ? d : "") + String(b[i]) : s, "");
        else if (typeof a[0] != "number") return b.reduce((s, bi, i) => (bi > 0 && i < a.length) ? s + (s != "" ? d : "") + String(a[i]) : s, "");
        else return a.reduce((w, ai, i) => w + (i < b.length ? (ai * b[i]) : (ai * d)), 0);
    }
    else return d;
}

/**
 * Vector addition a * c + b * d
 * @param {number[]} a First vector
 * @param {number[]} b Second vector
 * @param {number} c Coefficient of a
 * @param {number} d Coefficient of b
 * @returns {any}
 */
export function vec_add(a = [0], b = [0], c = 1, d = 1) {
    if (a.length < b.length) return vec_add(b, a, d, c);
    return a.map((ai, i) => c * ai + (i < b.length ? d * b[i] : 0), 0);
}

/**
 * Vector multiply scalar
 * @param {number[]} a The vector
 * @param {number} b The scalar
 * @returns {any}
 */
export function vec_mul(a = [0], b = 1) {
    if (typeof a == "number" && typeof b != "number") return vec_mul(b, a);
    return a.map(ai => ai * b);
}

/**
 * Vector check equal
 * @param {any[]} a The vector
 * @param {any[]} b The other vector
 * @returns {any}
 */
export function vec_equal(a = [0], b = [1]) {
    if (a.length != b.length) return false;
    else return a.reduce((s, ai, i) => s & (ai == b[i]), true);
}

/**
 * Vector check close
 * @param {number[]} a The vector
 * @param {number[]} b The other vector
 * @param {number} d Significant digits
 * @returns {any}
 */
export function vec_close(a = [0], b = [1], d = 4) {
    if (a.length != b.length) return false;
    else return a.reduce((s, ai, i) => s && close_to(Number(ai), Number(b[i]), d), true);
}

/**
 * Matrix multiply scalar
 * @param {number[][]} a The matrix
 * @param {number} b The scalar
 * @returns {any}
 */
export function mat_mul(a = [[0]], b = 1) {
    if (typeof a == "number" && typeof b != "number") return mat_mul(b, a);
    return a.map(ai => ai.map(aij => aij * b));
}

/**
 * Maximum of two vectors
 * @param {number[]} a First vector
 * @param {number[]} b Second vector
 * @returns {any}
 */
export function vec_max(a = [0], b = [0]) {
    return a.map((ai, i) => Math.max(ai, b[i]));
}

/**
 * Minimum of two vectors
 * @param {number[]} a First vector
 * @param {number[]} b Second vector
 * @returns {any}
 */
export function vec_min(a = [0], b = [0]) {
    return a.map((ai, i) => Math.min(ai, b[i]));
}

/**
 * Matrix dot row vector w
 * @param {number[][]} w The matrix
 * @param {number[]} x The row vector
 * @param {number} d Fill if one matrix is shorter
 * @returns {any}
 */
export function mat_dot_vec_row(w = [[0]], x = [0], d = 0) {
    return w.map(i => vec_dot(i, x, d));
}

/**
 * Matrix dot col vector w' x
 * @param {number[][]} w The matrix
 * @param {number[]} x The col vector
 * @param {number} d Fill if one matrix is shorter
 * @returns {any}
 */
export function mat_dot_vec_col(w = [[0]], x = [0], d = 0) {
    return w.reduce((s, wi, i) => vec_add(s, vec_mul(wi, i < x.length ? x[i] : d)), rep(0, w[0].length));
}

/**
 * Matrix two rows dot each other
 * @param {number[][]} w The matrix
 * @param {number} i The first row
 * @param {number} j The second row
 * @returns {any}
 */
export function mat_dot_rows(w = [[0]], i = 0, j = 0) {
    return vec_dot(w[i], w[j]);
}

/**
 * Matrix two cols dot each other
 * @param {number[][]} w The matrix
 * @param {number} i The first col
 * @param {number} j The second col
 * @returns {any}
 */
export function mat_dot_cols(w = [[0]], i = 0, j = 0) {
    return w.reduce((s, wi) => s + wi[i] * wi[j], 0);
}

export function linear_max(z = [0]) {
    let ez = z.map(i => i + 0.0001);
    let sz = vec_sum(ez);
    if (sz) return ez.map(i => i / sz);
    return rep(1 / z.length, z.length);
}

export function soft_max(z = [0]) {
    let mz = Math.max(...z);
    let ez = z.map(i => Math.exp(i - mz));
    let sz = vec_sum(ez);
    return ez.map(i => i / sz);
}

export function log_it(z = 0) {
    return 1 / (1 + Math.exp(-z));
}

/**
 * Sum up numbers in a vector
 * @param {number[]} x The vector
 * @returns {any}
 */
export function vec_sum(x = [0]) {
    return x.reduce((s, i) => s + i, 0);
}

/**
 * Generic sum
 * @param {function} f Function of i
 * @param {number} a From
 * @param {number} b To
 * @returns {number}
 */
export function gen_sum(f = i => i, a = 0, b = 10) {
    let sum = 0;
    for (let i = a; i <= b; i++) sum += f(i);
    return sum;
}

/**
 * Generic sum
 * @param {string} f Function of i
 * @param {string} i Variable name
 * @param {string} a From
 * @param {string} b To
 * @returns {any}
 */
export function gen_sum_page(f = "i", i = "i", a = "0", b = "10", out = "out") {
    let fun = get_str(f, "i");
    let name = get_str(i, "i");
    let from = get_num(a, 0);
    let tto = get_num(b, 10);
    let sum = 0;
    for (let i = from; i <= tto; i++) sum += math_eval_at(fun, name, i, 0);
    set_str(sum, out);
}

export function maze_heuristic(h = 1, w = 1, gh = h - 1, gw = (w - 1) / 2, l = 1) {
    let d = zero_mat(h, w, 0);
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            d[i][j] += dist([i, j], [gh, gw], l);
        }
    }
    return d;
}

export function parse_maze(maze = [""]) {
    let h = (maze.length - 1) / 2;
    if (!maze[0].length || maze[0].length == 0) return false;
    let w = (maze[0].length - 1) / 3;
    let list = zero_mat(h, w, "");
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            if (!maze[y].length || maze[y].length == w) return false;
            let i = 2 * y + 1;
            let j = 3 * x + 1;
            if (maze[i].charAt(j) != " " || maze[i].charAt(j + 1) != " ") return false;
            if (maze[i - 1].charAt(j) == " ") list[y][x] += "U";
            if (maze[i + 1].charAt(j) == " ") list[y][x] += "D";
            if (maze[i].charAt(j - 1) == " ") list[y][x] += "L";
            if (maze[i].charAt(j + 2) == " ") list[y][x] += "R";
        }
    }
    return list;
}

export function mat_sum(x = [[0]]) {
    return x.reduce((s, xi) => s + vec_sum(xi), 0);
}

export function get_suc_pos(suc = [[""]]) {
    let maze = zero_mat(suc.length, suc[0].length, 0);
    for (let i = 0; i < suc.length; i++) {
        for (let j = 0; j < suc[i].length; j++) {
            maze[i][j] = [];
            if (suc[i][j].includes("U") && i > 0) maze[i][j].push([i - 1, j]);
            if (suc[i][j].includes("D") && i < suc.length - 1) maze[i][j].push([i + 1, j]);
            if (suc[i][j].includes("L") && j > 0) maze[i][j].push([i, j - 1]);
            if (suc[i][j].includes("R") && j < suc[0].length - 1) maze[i][j].push([i, j + 1]);
        }
    }
    return maze;
}

/**
 * Rotate the array to the right (negative for left rotation)
 * @param {any[]} a The array
 * @param {number} s Rotation to the right
 * @returns {any}
 */
export function vec_rotate(a = [0], s = 1) {
    let na = a.length;
    let n;
    if (s < 0) n = na + s;
    else n = s;
    return [...a.slice(na - n, na), ...a.slice(0, na - n)];
}
/**
 * Check if a is a rotation of b
 * @param {any[]} a First array
 * @param {any[]} b Second array
 * @returns {any}
 */
export function vec_is_rotation(a = [0], b = [0]) {
    if (a.length != b.length) return false;
    for (let i in a) {
        if (String(vec_rotate(a, i)) == String(b)) return true;
    }
    return false;
}

/**
 * Get the inner variable in the outer class
 * @param {string} outer The class name
 * @param {string} inner The variable name
 * @param {any} def Default value
 * @returns {any}
 */
export function get_global(outer = "data", inner = "x", def = null) {
    if (!window[outer]) window[outer] = {};
    if (!window[outer][inner]) window[outer][inner] = def;
    return window[outer][inner];
}

/**
 * Set the inner variable in the outer class to x
 * @param {string} outer The class name
 * @param {string} inner The variable name
 * @param {any} x The variable value
 * @returns {any}
 */
export function set_global(outer = "data", inner = "x", x = []) {
    if (!window[outer]) window[outer] = {};
    window[outer][inner] = x;
}

/**
 * Get the list of objects associated with canvas
 * @param {string} canvas The name of the canvas
 * @returns {any}
 */
export function get_canvas_objects(canvas = "canvas") {
    return get_global("objects", field_name(canvas, false), []);
}

/**
 * Set the list of objects associated with canvas to objects
 * @param {string} canvas The name of the canvas
 * @param {any[]} objects The objects
 * @returns {any}
 */
export function set_canvas_objects(canvas = "canvas", objects = []) {
    set_global("objects", field_name(canvas, false), objects);
}

/**
 * Get the list of objects associated with canvas
 * @param {string} canvas The name of the canvas
 * @returns {any}
 */
export function get_canvas_lines(canvas = "canvas") {
    return get_global("lines", field_name(canvas, false));
}

/**
 * Set the list of lines associated with canvas to lines
 * @param {string} canvas The name of the canvas
 * @param {any[]} lines The lines
 * @returns {any}
 */
export function set_canvas_lines(canvas = "canvas", lines = []) {
    set_global("lines", field_name(canvas, false), lines);
}

/**
 * Get the data with name
 * @param {string} name name of the variable
 * @returns {any}
 */
export function get_data(name = "x") {
    return get_global("data", name);
}

/**
 * Set the data with name to x
 * @param {string} name The name of the variable
 * @param {number[]} x The variable array
 * @returns {any}
 */
export function set_data(name = "x", x = []) {
    set_global("data", name, x);
}

/**
 * Get the student's id
 * @returns {any}
 */
export function get_id() {
    return get_global("id", "main");
}

/**
 * Set the student's id
 * @param {string} x The id
 * @returns {any}
 */
export function set_id(x = "rand") {
    set_global("id", "main", x);
}

/**
 * Get the   export function with name
 * @param {string} name The name of the variable
 * @returns {any}
 */
export function get_func(name = "x") {
    return get_global("function", name);
}

/**
 * Set the   export function with name to f
 * @param {string} name The name of the variable
 * @param {function} f The name of the   function
 * @returns {any}
 */
export function set_func(name = "x", f = function () { }) {
    set_global("function", name, f);
}

export function ml_train_page(canvas = "canvas") {
    let n = 10;
    let x = rand(-1, 1, n, 2);
    let w = rand(-1, 1, 1, 3);
    let y = xor_label(x, w);
    set_data("x", x);
    set_data("y", y);
    let points = mat_to_points(x, y, "x");
    console.log(points);
    let objects = get_canvas_objects(canvas);
    objects.push(...points);
    //for (let i = 0; i < w.length; i++) objects.push(w_to_line(w[i], -1, -1, 1, 1));
    //let ww = train_percept(x, y);
    //objects.push(w_to_line(ww, -1, -1, 1, 1));
    let bounds = to_bound(-1, 1, -1, 1);
    let canvas_bound = get_canvas_bounding_box(canvas);
    scale_bounding_box(objects, bounds, canvas_bound);
    paint(canvas, [], objects);
}

/**
 * Create a bounding box object
 * @param {number|number[]|number[][]} a min x or (min x, max x) or ((min x, max x), (min y, max y))
 * @param {number|number[]} b max x or (min y, max y)
 * @param {number} c min y
 * @param {number} d max y
 * @param {boolean} row By row
 * @returns {any}
 */
export function to_bound(a = 0, b = 1, c = 0, d = 1, row = true) {
    if (is_mat(a)) return row ? { min_x: a[0][0], max_x: a[0][1], min_y: a[1][0], max_y: a[1][1] } : { min_x: a[0][0], max_x: a[1][0], min_y: a[0][1], max_y: a[1][1] };
    else if (is_vec(a) && is_vec(b)) return row ? { min_x: a[0], max_x: a[1], min_y: b[0], max_y: b[1] } : { min_x: a[0], max_x: b[0], min_y: a[1], max_y: b[1] };
    else return { min_x: a, max_x: b, min_y: c, max_y: d };
}

export function ml_init_page(canvas = "canvas") {
    let w = rand(-1, 1, 3);
    set_data("w", w);
    let objects = get_canvas_objects(canvas);
    let line = w_to_line(w, -1, -1, 1, 1);
    let bounds = to_bound(-1, 1, -1, 1);
    let canvas_bound = get_canvas_bounding_box(canvas);
    scale_bounding_box(line, bounds, canvas_bound);
    remove_object_by_type(objects, "line");
    objects.push(line);
    refresh_paint(canvas);
}

/**
 * Count the number of objects with obj.type = t
 * @param {object[]} list The list
 * @param {any} t Value
 * @returns {number}
 */
export function count_object_by_type(list = [], t = 0) {
    return count_object_by_value(list, "type", t);
}

/**
 * Count the number of objects with obj.t = v
 * @param {object[]} list The list
 * @param {string} t Parameter name
 * @param {any} v Value
 * @returns {number}
 */
export function count_object_by_value(list = [], t = "", v = 0) {
    return list.reduce((s, i) => i[t] == v ? s + 1 : s, 0);
}

/**
 * Set the obj.nt = nv if obj.type = t
 * @param {object[]} list The list
 * @param {string} t Value
 * @param {string} nt Parameter name to change
 * @param {any} nv Value
 * @returns {any}
 */
export function set_object_by_type(list = [], t = "", nt = "", nv = [0]) {
    set_object_by_value(list, "type", t, nt, nv);
}

/**
 * Set the obj.nt = nv if obj.t = v
 * @param {object[]} list The list
 * @param {string} t Parameter name
 * @param {any} v Value
 * @param {string} nt Parameter name to change
 * @param {any} nv Value
 * @returns {any}
 */
export function set_object_by_value(list = [], t = "", v = 0, nt = "", nv = [0]) {
    for (let i = list.length - 1; i >= 0; i--) {
        if ((!list[i][t] && !v) || list[i][t] == v) list[i][nt] = (is_vec(nv) ? get_i(nv, i) : nv);
    }
}

/**
 * Get the if obj.type = t
 * @param {object[]} list The list
 * @param {string} t Value
 * @returns {any}
 */
export function get_object_by_type(list = [], t = "") {
    return get_object_by_value(list, "type", t);
}

/**
 * Get the if obj.t = v
 * @param {object[]} list The list
 * @param {string} t Parameter name
 * @param {any} v Value
 * @returns {any}
 */
export function get_object_by_value(list = [], t = "", v = "") {
    let obj = [];
    for (let i = list.length - 1; i >= 0; i--) {
        if ((!list[i][t] && !v) || list[i][t] == v) obj.push(list[i]);
    }
    return obj;
}

/**
 * Remove objects in the list
 * @param {object[]} list The list
 * @param {string} t Type name
 * @returns {any}
 */
export function remove_object_by_type(list = [], t = "") {
    remove_object_by_value(list, "type", t);
}

/**
 * Remove objects in the list
 * @param {object[]} list The list
 * @param {string} t Property
 * @param {number|string|boolean} v The value
 * @returns {any}
 */
export function remove_object_by_value(list = [], t = "", v = 0) {
    for (let i = list.length - 1; i >= 0; i--) {
        if ((!list[i][t] && !v) || list[i][t] == v) list.splice(i, 1);
    }
}

export function highlight_point(list = [], d = "") {
    for (let i of list) {
        if (i.id == d) i.col = "black";
    }
}

export function ml_update_page(canvas = "canvas") {
    let x = get_data("x");
    let y = get_data("y");
    let w = get_data("w");
    let i = rand_int(0, y.length - 1);
    w = update_percept(x, y, w, i);
    set_data("w", w);
    let objects = get_canvas_objects(canvas);
    highlight_point(objects, "x" + i);
    let line = w_to_line(w, -1, -1, 1, 1);
    let bounds = to_bound(-1, 1, -1, 1);
    let canvas_bound = get_canvas_bounding_box(canvas);
    scale_bounding_box(line, bounds, canvas_bound);
    remove_object_by_type(objects, "line");
    objects.push(line);
    refresh_paint(canvas);
}

export function transition(y = [0], m = -1) {
    let n = (m > 1 ? m - 1 : Math.max(...y));
    let mat = zero_mat(n, n);
    for (let i = 1; i < y.length; i++) {
        mat[Math.floor(y[i - 1])][Math.floor(y[i])]++;
    }
    return normalize_sum_by_row(mat);
}

export function distribution(y = [0], m = -1) {
    let hist = hist_int(y, m - 1);
    let n = y.length;
    return hist.map(hi => hi / n);
}

export function hist_int(y = [0], m = -1) {
    let n = (m > 1 ? m : Math.max(...y));
    let list = zero_vec(n + 1);
    y.forEach(i => list[Math.floor(i)]++);
    return list;
}

/**
 * Return xor labels
 * @param {number[][]} x The x values
 * @param {number[][]} w The weights
 * @returns {number[]}
 */
export function xor_label(x = [[0]], w = [[0]]) {
    let n = x.length;
    let y = rep(0, n);
    for (let wi of w) {
        for (let i in x) y[i] = (y[i] + (vec_dot(x[i], wi, 1) > 0)) % 2;
    }
    return y;
}

/**
 * Trim characters from a string
 * @param {string} s The string
 * @param {string|string[]} t The list of prefix or suffix
 * @returns {string} 
 */
export function trim(s = "", t = [" "]) {
    let str = String(s).trim();
    if (str == "") return str;
    let starts = starts_with(str, t);
    let ends = ends_with(str, t);
    if (starts) str = str.substring(starts.length);
    if (ends) str = str.substring(0, str.length - ends.length);
    return str.trim();
}

/**
 * Convert string to string matrix
 * @param {string} s The string
 * @param {string} row The row separator of each element
 * @param {string} col The column separator of each element
 * @param {string} ol The outer left bracket
 * @param {string} or The outer right bracket
 * @param {string} il The inner left bracket
 * @param {string} ir The inner right bracket
 * @returns {string[][]}
 */
export function str_to_str_mat(s = "", row = ",", col = ",", ol = "[", or = "]", il = "[", ir = "]") {
    let str = get_str(s);
    if (str.trim() == "") return [[]];
    str = trim(str, [ol, or]);
    str = trim(str, [il, ir]);
    let list = [str];
    if (row.trim() != col.trim()) list = str.split(row);
    else if (ir.trim() != "") list = str.split(ir);
    else if (il.trim() != "") list = str.split(il);
    return list.map(i => trim(i, [il, ir]).split(col));
}

/**
 * Special page version string to string matrix
 * @param {string} s The string
 * @returns {string[][]}
 */
export function str_to_str_mat_line(s = "", comma = ",") {
    return str_to_str_mat(s, "\n", comma, "", "", "", "");
}

/**
 * Convert string matrix to double matrix
 * @param {string[][]} mat String matrix
 * @param {boolean} eva Whether to evaluate
 * @returns {number[][]}
 */
export function str_mat_to_mat(mat = [[]], eva = false) {
    if (!eva) return mat.map(i => i.map(j => Number(j)));
    else return mat.map(i => i.map(j => get_eval(j, 0)));
}

/**
 * Convert string to double matrix
 * @param {string} s The string
 * @param {string} row The row separator of each element
 * @param {string} col The column separator of each element
 * @param {string} ol The outer left bracket
 * @param {string} or The outer right bracket
 * @param {string} il The inner left bracket
 * @param {string} ir The inner right bracket
 * @returns {number[][]}
 */
export function str_to_mat(s = "", eva = false, row = ",", col = ",", ol = "[", or = "]", il = "[", ir = "]") {
    return str_mat_to_mat(str_to_str_mat(s, row, col, ol, or, il, ir), eva);
}

/**
 * Special page version string to string matrix
 * @param {string} s The string
 * @returns {number[][]}
 */
export function str_to_mat_line(s = "", eva = false) {
    return str_to_mat(s.trim(), eva, "\n", ",", "", "", "", "");
}

/**
 * Convert string to string vector
 * @param {string} s The string
 * @param {string} sep The separator of each element
 * @param {string} l The left bracket
 * @param {string} r The right bracket
 * @returns {string[]}
 */
export function str_to_str_vec(s = "", sep = ",", l = "[", r = "]") {
    let str = get_str(s);
    if (str == "") return [""];
    str = trim(str, [l, r]);
    return str.split(sep);
}

/**
 * Convert string vector to double vector
 * @param {string[]} vec String matrix
 * @param {boolean} eva Whether to evaluate
 * @returns {number[]}
 */
export function str_vec_to_vec(vec = [], eva = false) {
    if (!eva) return vec.map(i => Number(i));
    else return vec.map(i => get_eval(i, 0));
}

/**
 * Convert string to double vector
 * @param {string} s The string
 * @param {boolean} eva Whether to evaluate
 * @param {string} sep The separator of each element
 * @param {string} l The left bracket
 * @param {string} r The right bracket
 * @returns {number[]}
 */
export function str_to_vec(s = "", eva = false, sep = ",", l = "[", r = "]") {
    return str_vec_to_vec(str_to_str_vec(s, sep, l, r), eva);
}

/**
 * Convert vector to color
 * @param {number[]} x Vector
 * @param {number} max Number of classes or -1
 * @param {boolean} fast Whether to assume x is integer 
 * @returns {string[]}
 */
export function vec_to_color(x = [0], max = -1, fast = false) {
    let t = max <= 0 ? n_cat(x) : max;
    if (fast) {
        let c = color_wheel(t);
        return x.map(i => c[i]);
    }
    else return x.map(i => class_to_color(i, t));
}

/**
 * Convert rbg to hsl
 * @param {number[]} x The rgb values
 * @param {boolean} frac Whether the values are from 0 to 1
 * @returns {number[]}
 */
export function rgb_to_hsl(x = [], frac = false) {
    let r = x[0] / (frac ? 1 : 255);
    let g = x[1] / (frac ? 1 : 255);
    let b = x[2] / (frac ? 1 : 255);
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let sum = max + min;
    let diff = max - min;
    let l = (max + min) * 0.5;
    let s = 0;
    let h = 0;
    if (max != min) {
        if (l < 0.5) s = diff / sum;
        else s = diff / (2.0 - sum);
        if (r == max) h = (g - b) / diff;
        else if (g == max) h = 2.0 + (b - r) / diff;
        else h = 4.0 + (r - g) / diff;
    }
    if (h < 0) h += 6;
    return [h * 60, s * 100, l * 100];
}

/**
 * Convert string to rgb vector
 * @param {string} name Color name
 * @returns {number[]}
 */
export function str_to_rgb(name = "black") {
    let fakeDiv = document.createElement("div");
    fakeDiv.style.color = name;
    document.body.appendChild(fakeDiv);
    let cs = window.getComputedStyle(fakeDiv);
    let pv = cs.getPropertyValue("color");
    document.body.removeChild(fakeDiv);
    let rgb = pv.substr(4).split(")")[0].split(",");
    return [Number(rgb[0]), Number(rgb[1]), Number(rgb[2])];
}

/**
 * Convert string to hsl vector
 * @param {string} name Color name
 * @returns {number[]}
 */
export function str_to_hsl(name = "black") {
    return rgb_to_hsl(str_to_rgb(name));
}

/**
 * Convert rgb to string
 * @param {number[]} color 
 * @returns {string}
 */
export function rgb_to_str(color = [0, 0, 0]) {
    return combine_str(color, ", ", "rgba(", ")");
}

/**
 * Convert hsl to string
 * @param {number[]} color 
 * @returns {string}
 */
export function hsl_to_str(color = [0, 0, 0]) {
    return "hsla(" + color[0] + ", " + color[1] + "%, " + color[2] + "%)";
}

/**
 * Convert 0 to n a HSLA color
 * @param {number} x Value from 0 to 1
 * @param {number} n Number of classes
 * @param {number} sat Saturation (0 to 100)
 * @param {number} light Lightness (0 to 100)
 * @param {number} alpha Alpha (0 to 1)
 * @returns {any}
 */
export function class_to_color(x = 0, n = 3, sat = 100, light = 50, alpha = 1) {
    return combine_str([x * Math.floor(360 / n), sat + "%", light + "%", alpha], ", ", "hsla(", ")");
}

/**
 * Generate a list of equally spaced colors
 * @param {number} n The number of colors
 * @param {number} sat The saturation 0 to 100
 * @param {number} light The lightness 0 to 100
 * @param {number} alpha The alpha 0 to 1
 * @returns {any}
 */
export function color_wheel(n = 3, sat = 100, light = 50, alpha = 1) {
    return Array.from({ length: n }, (_, i) => class_to_color(i, n, sat, light, alpha));
}

/**
 * Left + join(s) + right
 * @param {(string|number)[]} s List of string
 * @param {string} sep Separator 
 * @param {string} left Prefix
 * @param {string} right Suffix
 * @returns {any}
 */
export function combine_str(s = [], sep = "", left = "", right = "", digit = -1) {
    return left + s.reduce((t, x, i) => ((i > 0) ? (t + sep + x) : x), "") + right;
}

export function ltu(z) {
    return z >= 0 ? 1 : 0;
}

export function loss_one(x = [0], y = 0, w = [[0]], activation = activate_soft_max, loss = loss_soft_max) {
    return loss(activation(x, w), y);
}

export function loss_all(x = [[0]], y = [0], w = [[0]], activation = activate_soft_max, loss = loss_soft_max) {
    return x.reduce((s, xi, i) => s + loss_one(xi, y[i], w, activation, loss), 0) / x.length;
}

export function loss_soft_max(output = [0], y = 0) {
    return -vec_dot(output.map(Math.log), one_hot(y, output.length));
}

export function one_hot(y = 0, n = 1) {
    let out = Array(n).fill(0);
    if (Array.isArray(y)) {
        for (let yi of y) {
            if (yi >= 0 && yi < n) out[Math.floor(yi)]++;
        }
        return out;
    }
    else if (y >= 0 && y < n) out[Math.floor(y)] = 1;
    return out;
}

export function log_it_grad(x = 0, g = 0) {
    return g * (1 - g);
}

export function test_nn() {
    let w = [[[1, -10], [-1, 10], [-0.5, -5]], [[1], [1], [-0.5]]];
    let x = [[0, 0], [0, 1], [1, 0], [1, 1]];
    //w = [[[2.5, -1.5], [1, -3], [1.5, 2]], [[1], [0.5], [-1]]];
    //x = [0, 1];
    let y = 1;
    //let activate_nn_ltu = (x, w) => activate_nn(x, w, ltu);
    console.log(activate_all_nn(x, w));
    console.log(activate_nn(x, w));
    update_nn(x, y, w, 0.1);
}

export function update_percept(x = [[0]], y = [0], w = { w: [0] }, i = 0, param = { alpha: 0.1 }) {
    let xs = x[i];
    if (w.scale) xs = scale_vec(xs, w.scale, [0, 1]);
    let ai = vec_dot(w.w, xs, 1) >= 0 ? 1 : 0;
    let nw = vec_add(w.w, xs, 1, - param.alpha * (ai - y[i]));
    nw[nw.length - 1] -= param.alpha * (ai - y[i]);
    return { w: nw, scale: w.scale };
}

export function update_percept_batch(x = [[0]], y = [0], w = { w: [0] }, param = { alpha: 0.1 }) {
    let nw = w;
    for (let i = 0; i < x.length; i++) nw = update_percept(x, y, w, i, param);
    return nw;
}

export function update_logistic(x = [[0]], y = [0], w = { w: [0] }, i = 0, param = { alpha: 1 }) {
    let ai = activate_logistic(x[i], w);
    let db = - param.alpha * (ai - y[i]) * ai * (1 - ai);
    let nw = [];
    if (w.scale) nw = vec_add(w.w, scale_vec(x[i], w.scale, [0, 1]), 1, db);
    else nw = vec_add(w.w, x[i], 1, db);
    nw[nw.length - 1] += db;
    return { w: nw, scale: w.scale };
}

export function update_logistic_batch(x = [[0]], y = [0], w = { w: [0] }, param = { alpha: 1 }) {
    let dw = rep(0, w.w.length);
    for (let i in x) {
        let ai = activate_logistic(x[i], w);
        let db = (ai - y[i]) * ai * (1 - ai);
        if (w.scale) dw = vec_add(dw, scale_vec(x[i], w.scale, [0, 1]), 1, db);
        else dw = vec_add(dw, x[i], 1, db);
        dw[dw.length - 1] += db;
    }
    return { w: vec_add(w.w, dw, 1, -param.alpha), scale: w.scale };
}

export function update_nn(x = [0], c = 0, w = [[[0]]], alpha = 0.1, activation = log_it, gradient = log_it_grad) {
    let k = w[w.length - 1][0].length;
    let t = k == 1 ? [c] : one_hot(c, k);
    let a = activate_all_nn(x, w, activation);
    let y = a[a.length - 1];
    let dk = vec_add(y, t, 1, -1);
    //let dw = [];
    let nw = [];
    for (let i = w.length - 1; i >= 0; i--) {
        for (let j = dk.length - 1; j >= 0; j--) {
            dk[j] *= gradient(0, a[i + 1][j]);
        }
        let ctw = mat_mul(vec_dot_vec([...a[i], 1], dk), alpha);
        //dw.unshift(ctw);
        nw.unshift(mat_add(w[i], ctw, 1, -1));
        dk = mat_dot_vec_row(w[i], dk, 0);
    }
    return nw;
}

export function activate_all_nn(x = [0], w = { w: [[[0]]] }, activation = log_it) {
    let units = [x];
    w.w.forEach((wi, i) => units.push(activate_layer(units[i], wi, activation)));
    return units;
}

export function activate_logistic(x = [0], w = { w: [0] }) {
    if (w.scale) return log_it(vec_dot(scale_vec(x, w.scale, [0, 1]), w.w, 1));
    else return log_it(vec_dot(x, w.w, 1));
}

/**
 * Activate a neural network layer
 * @param {number[]} x The vector
 * @param {number[][]} w The weights (object or matrix)
 * @param {function} activation The activation function
 * @returns {any}
 */
export function activate_layer(x = [0], w = [[0]], activation = log_it) {
    let z = mat_dot_vec_col(w, x, 1);
    return z.map(i => activation(i));
}

/**
 * Activate a neural network
 * @param {number[]} x The vector
 * @param {any} w The weights (object or matrix)
 * @param {function} activation The activation function
 * @returns {any}
 */
export function activate_nn(x = [0], w = { w: [[[0]]] }, activation = log_it) {
    let act = w.w.reduce((s, wi) => activate_layer(s, wi, activation), x);
    return act.length == 1 ? act[0] : act;
}

/**
 * Apply activation function to a vector
 * @param {number[][]} x The matrix
 * @param {any} w The weights (object or matrix)
 * @param {function} activation The activation function
 * @returns 
 */
export function activate_vec(x = [[0]], w = [0], activation = log_it) {
    return x.map(i => activation(i, w));
}

export function activate_log_page(test = "canvas_log", weights = "log_weights", act = "act_log", label = "class_log", d0 = "d1_0", d1 = "d2_0", digit = "digit_log", feature = "feature_log") {
    set_str("", [act, label, digit]);
    let objects = get_canvas_objects(test);
    let list = get_object_by_type(objects, "grid");
    let digit0 = get_str(d0, "0", true);
    let digit1 = get_str(d1, "1", true);
    if (list.length) {
        let x = flatten(list[0].mat);
        let w = str_to_vec(get_str(weights, "", true), false);
        let c = activate_logistic(x, { w: w });
        let lab = Math.round(c);
        set_str([String(round(c, 2)), String(lab), (lab == 1 ? digit1 : digit0), vec_to_str_line(x)], [act, label, digit, feature]);
    }
}

export function activate_nn_page(test = "canvas_nn", in_weights = "in_weights", out_weights = "out_weights", act = "act_nn", label = "class_nn", d0 = "d1_0", d1 = "d2_0", digit = "digit_nn", feature = "feature_nn") {
    set_str("", [act, label, digit]);
    let objects = get_canvas_objects(test);
    let list = get_object_by_type(objects, "grid");
    let digit0 = get_str(d0, "0", true);
    let digit1 = get_str(d1, "1", true);
    if (list.length) {
        let x = flatten(list[0].mat);
        let w1 = str_to_mat_line(get_str(in_weights, "", true), false);
        let w2 = transpose(str_to_vec(get_str(out_weights, "", true), false));
        let c = activate_nn(x, { w: [w1, w2] });
        let lab = Math.round(c);
        set_str([String(round(c, 2)), String(lab), (lab == 1 ? digit1 : digit0), vec_to_str_line(x)], [act, label, digit, feature]);
    }
}

export function activate_tree_page(fields = "feature", number = "10", test = "tree", tree = "tree", output = "output", feature = "feature") {
    set_str("", output);
    let m = get_num(number, 10, false);
    let item = str_to_vec(get_str(test, "", true));
    for (let i = 0; i < item.length; i++) set_str(item[i], fields + (i + 1));
    if (item.length != m) {
        item = zero_vec(m);
        for (let i = 0; i < m; i++) item[i] = get_num(fields + (i + 1), 0, false, true);
    }
    let d_tree = list_to_d_tree(get_str(tree, "", true).split("\n"));
    let a = activate_d_tree(item, { tree: d_tree });
    set_str(a, output);
    set_str(vec_to_str_line(item), feature);
}

export function update_none(x = [[0]], y = [0], w = { w: [0] }, param = {}) {
    return w;
}

export function train_iterative(x = [[0]], y = [0], update_one = update_none, param = { alpha: 0.1, initial: { w: [0] }, max_iter: 100, scale: false }) {
    let xs = x;
    let w = param.initial;
    let scale;
    if (param.scale && !w.scale) {
        scale = ext_by_col(x);
        xs = scale_mat_by_col(x, scale, [0, 1]);
    }
    if (w.scale) scale = w.scale;
    w.scale = undefined;
    let iter = param.max_iter || 100;
    for (let i = 0; i < iter; i++) w = update_one(xs, y, w, param);
    w.scale = scale;
    return w;
}

export function train_percept(x = [[0]], y = [0], param = { alpha: 0.1, initial: { w: [0] }, max_iter: 100, scale: false }) {
    if (!param.initial || !param.initial.w || param.initial.w.length != x[0].length + 1) param.initial = { w: rand(-1, 1, x[0].length + 1) };
    return train_iterative(x, y, update_percept_batch, param);
}

export function train_logistic(x = [[0]], y = [0], param = { alpha: 0.1, initial: { w: [0] }, max_iter: 100, scale: false }) {
    if (!param.initial || !param.initial.w || param.initial.w.length != x[0].length + 1) param.initial = { w: rep(0, x[0].length + 1) };
    return train_iterative(x, y, update_logistic_batch, param);
}

export function train_nn(x = [[0]], y = [0], units = [x[0].length]) {
    let m = x[0].length;
    let nl = units.length;
    let w = [];
    w.push(rand(-1, 1, m, units[0]));
    for (let i = 1; i < units.length; i++) w.push(rand(-1, 1, units[i - 1], units[i]));
    w.push(rand(units[nl - 1], 2));
    return w;
}

export function train_svm(x = [[0]], y = [0]) {
    let m = x[0].length;
    let w = rand(-1, 1, m + 1);
    let eta = 1;
    let lam = 0.1;
    for (let t = 0; t < 20; t++) {
        for (let i in x) {
            eta = 1 / (lam * t);
            if (y[i] * vec_dot(w, x[i], 1) < 1) w = vec_add(w, x, (1 - eta * lam), (eta * y[i]));
            else w = vec_add(w, x, (1 - eta * lam), 0);
        }
    }
    return w;
}

export function train_knn(x = [[0]], y = [0], k = 1, param = { l: 2 }) {
    return { x: x, y: y, k: k, l: param.l || 2 };
}

export function classify_percept(x = [0], w = { w: rep(0, x.length + 1) }) {
    if (w.scale) return vec_dot(scale_vec(x, w.scale, [0, 1]), w.w, 1) > 0 ? 1 : 0;
    else return vec_dot(x, w.w, 1) > 0 ? 1 : 0;
}

export function classify_logistic(x = [0], w = { w: [0] }) {
    let prob = activate_logistic(x, w);
    return prob <= 0.5 ? 0 : 1;
}

export function classify_soft_max(x = [0], w = [[0]]) {
    return arg_max(activate_soft_max(x, w));
}

export function classify_nn(x = [0], w = { w: [[[0]]] }, activation = log_it) {
    let act = activate_nn(x, w, activation);
    return typeof act == "number" ? Math.round(act) : arg_max(act);
}

export function classify_knn(x = [0], w = { x: [[0]], y: [0], k: 1, l: 2 }) {
    let d = w.x.map(i => dist(x, i, w.l));
    let ind = arg_min_k(d);
    let y_hat = ind.map(i => w.y[i]);
    return mode(y_hat);
}

export function classify_guess(x = [0], w = {}) {
    return rand_int(0, 1);
}

/**
 * Classify matrix of vectors
 * @param {number[][]} x Data
 * @param {object} w Model
 * @param {function} classifier 
 * @returns {any[]}
 */
export function classify_vec(x = [[0]], w = {}, classifier = classify_guess) {
    return x.map(xi => classifier(xi, w));
}

/**
 * Classify matrix of vectors
 * @param {number[][][]} x Data
 * @param {object} w Model
 * @param {function} classifier 
 * @returns {number[][]|number[][][]}
 */
export function classify_mat(x = [[[0]]], w = {}, classifier = classify_guess) {
    return x.map(xi => xi.map(xii => classifier(xii, w)));
}

export function classify_page(data = "data", predict = "pred", max_iter = "1", alpha = "0.1", update_one = update_none, update_all = update_none, classify_one = classify_guess) {
    let obj = get_canvas_objects(data);
    let x = get_mat_from_objects(obj);
    let y = get_label_from_objects(obj);
    if (x.length > 1) {
        let model = get_object_by_type(obj, "model");
        let w = model.length > 0 ? model[0].w : {};
        let iter = get_num(max_iter, 1);
        let alp = get_num(alpha, 0.1);
        remove_object_by_type(obj, "rect");
        let ny = Math.max(...y) + 1;
        if (iter <= 1) {
            let i = rand_int(0, x.length - 1);
            w = update_one(x, y, w, i, { alpha: alp });
            let wheel = color_wheel(ny);
            let cc = 10;
            obj.push({ type: "rect", x0: x[i][0] - cc, y0: x[i][1] - cc, x1: x[i][0] + cc, y1: x[i][1] + cc, col: wheel[y[i]] });
        }
        else w = update_all(x, y, { alpha: alp, initial: w, max_iter: iter, scale: true });
        if (model.length > 0) model[0].w = w;
        else obj.push({ type: "model", w: w });
        let bounds = get_canvas_bounding_box(data);
        let grid = double_partition(bounds.min_x, bounds.max_x, 100, bounds.min_y, bounds.max_y, 100);
        let y_hat = transpose_flip_y(classify_mat(grid, w, classify_one));
        let objects = [{ type: "grid", cts: false, fill: color_wheel(ny), mat: y_hat, x0: bounds.min_x, y0: bounds.min_y, x1: bounds.max_x, y1: bounds.max_y, border: false }];
        two_paint(predict, objects);
    }
}

export function percept_page(data = "data", predict = "pred", max_iter = "1", alpha = "0.1") {
    classify_page(data, predict, max_iter, alpha, update_percept, train_percept, classify_percept);
}

export function logistic_page(data = "data", predict = "pred", max_iter = "1", alpha = "0.1") {
    classify_page(data, predict, max_iter, alpha, update_logistic, train_logistic, classify_logistic);
}

export function knn_page(data = "data", predict = "pred") {
    let obj = get_canvas_objects(data);
    let x = get_mat_from_objects(obj);
    let y = get_label_from_objects(obj);
    if (x.length > 1) {
        let w = train_knn(x, y, 1);
        let bounds = get_canvas_bounding_box(data);
        let grid = double_partition(bounds.min_x, bounds.max_x, 100, bounds.min_y, bounds.max_y, 100);
        let y_hat = transpose_flip_y(classify_mat(grid, w, classify_knn));
        let objects = [{ type: "grid", cts: false, fill: color_wheel(3), mat: y_hat, x0: bounds.min_x, y0: bounds.min_y, x1: bounds.max_x, y1: bounds.max_y, border: false }];
        two_paint(predict, objects);
    }
}

/**
 * Classification using a decision tree
 * @param {number[]} x The item
 * @param {object} w The tree
 * @returns 
 */
export function activate_d_tree(x = [0], w = { tree: {}, compare: (a, b) => a <= b }) {
    if (!w.compare) w.compare = (a, b) => a <= b;
    return activate_stump(x, w.tree, w.compare);
}

export function activate_stump(x = [0], tree = {}, compare = (a, b) => a <= b) {
    if (tree.left || tree.right) {
        if (x[tree.variable - 1] && compare(x[tree.variable - 1], tree.threshold)) return activate_stump(x, tree.left, compare);
        else if (x[tree.variable - 1]) return activate_stump(x, tree.right, compare);
        else return tree.label || 0;
    }
    else return tree.label || 0;
}

export function list_to_d_tree(list = [], left = "if", right = "else", ignore = "else if", vary = "x", compare = "<=", label = "return", current = 0) {
    if (current < 0 || current >= list.length) return { label: 0 };
    let cur = list[current].trim().toLowerCase().replace(/\(|\)/g, "");
    let root = {};
    if (cur.startsWith(ignore)) return list_to_d_tree(list, left, right, ignore, vary, compare, label, current + 1);
    else if (cur.startsWith(left)) {
        let x = get_num(substring_between(cur, vary, compare).trim(), 0);
        let t = get_num(substring_between(cur, compare, label).trim(), 0);
        root.variable = x;
        root.threshold = t;
        if (cur.includes(label)) {
            let y = get_num(substring_between(cur, label, "").trim(), 0);
            root.left = { label: y };
        }
        else root.left = list_to_d_tree(list, left, right, ignore, vary, compare, label, current + 1);
        let match = find_match(list, current, left, right, ignore);
        if (match < 0) return { label: 0 };
        root.right = list_to_d_tree(list, left, right, ignore, vary, compare, label, match);
        return root;
    }
    else if (cur.startsWith(right)) {
        if (cur.includes(label)) {
            let y = get_num(substring_between(cur, label, "").trim(), 0);
            return { label: y };
        }
        else return list_to_d_tree(list, left, right, ignore, vary, compare, label, current + 1);
    }
    else return list_to_d_tree(list, left, right, ignore, vary, compare, label, current + 1);
}

export function find_match(list = [], current = 0, left = "if", right = "else", ignore = "else if") {
    let cur = "";
    let match = 0;
    for (let i = current + 1; i < list.length; i++) {
        cur = list[i].trim().toLowerCase();
        if (cur.startsWith(ignore)) match += 0;
        else if (cur.startsWith(left)) match++;
        else if (cur.startsWith(right)) match--;
        if (match < 0) return i;
    }
    return -1;
}

export function var_of_list(list = [], vars = [], left = "if", vary = "x", compare = "<=") {
    let n = list.length;
    let sv = vars.map(v => String(v).trim());
    for (let i = 0; i < n; i++) {
        let line = list[i].trim().toLowerCase().replace(/\(|\)/g, "");
        if (line.startsWith(left)) {
            if (line.includes(vary) || line.includes(compare)) {
                let cur = substring_between(line, vary, compare).trim();
                if (!sv.includes(cur)) return false;
            }
        }
    }
    return true;
}

export function depth_of_list(list = [], left = "if", right = "else", ignore = "else if") {
    let n = list.length;
    let cur = 0;
    let max = 0;
    let level = [];
    for (let i = 0; i < n; i++) {
        let line = list[i].trim().toLowerCase();
        if (line.startsWith(ignore)) cur += 0;
        else if (line.startsWith(left)) {
            cur++;
            level.push(1);
        }
        else if (line.startsWith(right)) {
            if (cur < 1) return -1;
            while (cur > 0 && level[cur - 1] == 0) {
                cur--;
                level.pop();
            }
            level[cur - 1] = 0;
        }
        max = Math.max(cur, max);
    }
    while (cur > 0 && level[cur - 1] == 0) {
        cur--;
        level.pop();
    }
    if (cur != 0) return -1;
    return max;
}

export function transpose_flip_y(x = [[0]]) {
    return x[0].map((_, i) => x.map(row => row[row.length - i - 1]));
}

/**
 * Transpose a matrix
 * @param {any} x The matrix (or vector)
 * @returns {any[][]}
 */
export function transpose(x = [[0]]) {
    if (is_mat(x)) {
        let t = x[0].map((_, i) => x.map((_, j) => x[j][i]));
        if (t.length == 1) return t[0];
        else return t;
    }
    else if (is_vec(x)) return x.map(xi => [xi]);
    else return [[x]];
}

export function arg_min_k(x = [0], k = 1) {
    if (k == 1) return [arg_min(x)];
    else return arg_sort(x, true).slice(0, k);
}

export function arg_max_k(x = [0], k = 1) {
    if (k == 1) return [arg_max(x)];
    else return arg_sort(x, false).slice(0, k);
}

export function sort(x = [0], incr = true) {
    return x.sort((incr ? (a, b) => a - b : (a, b) => b - a));
}

export function arg_sort(x = [0], incr = true) {
    let ix = x.map((xi, i) => [xi, i]);
    if (incr) ix.sort((a, b) => a[0] - b[0]);
    else ix.sort((a, b) => b[0] - a[0]);
    return ix.map(xi => xi[1]);
}

export function mode(x = [0]) {
    let set = to_set(x);
    let count = x.reduce((s, i) => incr(s, set.indexOf(i)), zero_vec(set.length));
    return x[arg_max(count)];
}

export function incr_i(s = [0], i = 0, incr = 1) {
    s[i] += incr;
    return s;
}

export function to_set(x = [0]) {
    return x.reduce((s, i) => add_to_set(s, i), []);
}

export function add_to_set(x = [0], i = 0) {
    if (!x.includes(i)) x.push(i);
    return x;
}

export function classify_svm(x = [0], w = [0]) {
    return vec_dot(x, w, 1) > 0 ? 1 : 0;
}

export function train_d_tree(x = [[0]], y = [0]) {
    let m = x[0].length;
    let info_gain = [];
    for (let i = 0; i < m; i++) info_gain.push(cond_entropy_mat(y, x, i));
    return arg_max(info_gain);
}

/**
 * Compute the entropy based on counts
 * @param {number[]} c The counts
 * @returns {any}
 */
export function entropy_count(c = [0]) {
    let total = vec_sum(c);
    return c.reduce((s, ci) => s - ci / total * Math.log2(ci / total), 0);
}

/**
 * Compute the entropy based on distribution probabilities
 * @param {number[]} p The probabilities
 * @returns {any}
 */
export function entropy_prob(p = [0]) {
    return p.reduce((s, pi) => s - pi * Math.log2(pi), 0);
}

/**
 * Compute the entropy based on data
 * @param {number[]} y The complete vector
 * @returns {any}
 */
export function entropy(y = [0]) {
    let k = Math.max(...y);
    let count = rep(0, k);
    let n = y.length;
    for (let i of y) count[i]++;
    return count.reduce((s, i) => s - i / n * Math.log2(i / n), 0);
}

/**
 * Compute the conditional entropy based on counts
 * @param {number[]} c The counts of y
 * @param {number[]} cx The counts of x, (x = 0, x = 1) for y = 0, then (x = 0, x = 1) for y = 1
 * @returns {any}
 */
export function cond_entropy_count(c = [0], cx = [0]) {
    let total = vec_sum(c);
    let mat = reshape(cx, c.length);
    let mx = col_sum(mat);
    return mat.reduce((s, mi) => mi.reduce((ss, mj, i) => ss - mj / total * Math.log2(mj / mx[i]), s), 0);
}

/**
 * Compute the conditional entropy based on data
 * @param {number[]} y The complete vector y
 * @param {number[]} x The complete vector x
 * @returns {any}
 */
export function cond_entropy(y = [0], x = [0]) {
    let k = Math.max(...y) + 1;
    let kj = Math.max(...x) + 1;
    let n = y.length;
    let count = rep(0, k, kj);
    let count_x = rep(0, kj);
    for (let i in y) count[y[i]][x[i]]++;
    for (let i in y) count_x[x[i]]++;
    let ent = 0;
    for (let i = 0; i < kj; i++) {
        for (let j = 0; j < k; j++) ent -= count[j][i] / n * Math.log2(count[j][i] / count_x[i]);
    }
    return ent;
}

export function cond_entropy_mat(y = [0], x = [[0]], j = 0) {
    return cond_entropy(y, get_col(x, j));
}

export function info_gain(c = [0, 0, 0, 0]) {
    let y = [c[0] + c[1], c[2] + c[3]];
    return entropy_count(y) - cond_entropy_count(y, c);
}

/**
 * The maximum of column j
 * @param {number[][]} x The matrix
 * @param {number} j The col index
 * @returns {any}
 */
export function max_by_col(x = [[0]], j = -1) {
    if (j >= 0) return x.reduce((s, i) => Math.max(s, i[j]), x[0][j]);
    else return x[0].map((_, i) => max_by_col(x, i));
}

/**
 * The minimum of column j
 * @param {number[][]} x The matrix
 * @param {number} j The col index
 * @returns {any}
 */
export function min_by_col(x = [[0]], j = -1) {
    if (j >= 0) return x.reduce((s, i) => Math.min(s, i[j]), x[0][j]);
    else return x[0].map((_, i) => min_by_col(x, i));
}

/**
 * The maximum and minimum of column j
 * @param {number[][]} x The matrix
 * @param {number} j The col index
 * @returns {any}
 */
export function ext_by_col(x = [[0]], j = -1) {
    if (j >= 0) return x.reduce((s, i) => [Math.min(s[0], i[j]), Math.max(s[1], i[j])], [x[0][j], x[0][j]]);
    else return x[0].map((_, i) => ext_by_col(x, i));
}

/**
 * The range (max - min) of column j
 * @param {number[][]} x The matrix
 * @param {number} j The col index
 * @returns {any}
 */
export function range_by_col(x = [[0]], j = -1) {
    if (j >= 0) {
        let ext = ext_by_col(x, j);
        return ext[1] - ext[0];
    }
    else return x[0].map((_, i) => range_by_col(x, i));
}

/**
 * Sum by row
 * @param {number[][]} x The matrix
 * @returns {any}
 */
export function row_sum(x = [[0]]) {
    return x.map(row => vec_sum(row));
}

/**
 * Sum by column
 * @param {number[][]} x The matrix
 * @returns {any}
 */
export function col_sum(x = [[0]]) {
    return x.reduce((s, i) => vec_add(s, i), zero_vec(x[0].length));
}

/**
 * Mean by row
 * @param {number[][]} x The matrix
 * @returns {any}
 */
export function row_mean(x = [[0]]) {
    return x.map(row => vec_sum(row) / row.length);
}

/**
 * Mean by column
 * @param {number[][]} x The matrix
 * @returns {any}
 */
export function col_mean(x = [[0]]) {
    return vec_mul(x.reduce((s, i) => vec_add(s, i), zero_vec(x[0].length)), 1 / x.length);
}

/**
 * Min by column
 * @param {number[][]} x The matrix
 * @returns {any}
 */
export function col_min(x = [[0]]) {
    return x.reduce((s, i) => vec_min(s, i), x[0]);
}

/**
 * Max by column
 * @param {number[][]} x The matrix
 * @returns {any}
 */
export function col_max(x = [[0]]) {
    return x.reduce((s, i) => vec_max(s, i), x[0]);
}

export function rand_index(c1 = [0], c2 = [0], adjusted = true) {
    let table = contingency_table(c1, c2);
    let a = row_sum(table);
    let b = col_sum(table);
    let n = vec_sum(a);
    let as = a.reduce((s, ai) => s + choose(ai, 2), 0);
    let bs = b.reduce((s, bi) => s + choose(bi, 2), 0);
    let ns = table.reduce((si, ti) => si + ti.reduce((sij, tj) => sij + choose(tj, 2), 0), 0);
    let n2 = choose(n, 2);
    return (ns - as * bs / n2) / (0.5 * (as + bs) - as * bs / n2);
}

/**
 * Compute n choose x
 * @param {number} n Total
 * @param {number} x Choice
 */
export function choose(n = 1, x = 0) {
    if (n < x) return 0;
    else if (x > n / 2) return choose(n, n - x);
    else return factorial(n, n - x) / factorial(x);
}

/**
 * Factorial
 * @param {number} n The number
 */
export function factorial(n = 1, limit = 1) {
    return n <= limit ? 1 : n * factorial(n - 1, limit);
}

export function contingency_table(c1 = [0], c2 = [0]) {
    let k = Math.max(Math.max(...c1), Math.max(...c2)) + 1;
    let table = zero_mat(k, k, 0);
    for (let i = 0; i < Math.min(c1.length, c2.length); i++) table[bound(c1[i], 0, k - 1)][bound(c2[i], 0, k - 1)]++;
    return table;
}

/**
 * Split the string according to a list (the first one the string contains)
 * @param {string} s The string to split
 * @param {string|string[]} sep The separator
 * @returns {any}
 */
export function split_list(s = "", sep = ["\n", ";", ",", " "]) {
    if (Array.isArray(sep)) {
        let ind = contain_index(s, sep);
        if (ind < 0) return [s];
        else return s.split(sep[ind]);
    }
    else if (typeof sep == "string") return s.split(sep);
}

/**
 * Find the index of the first substring the string contains
 * @param {string} s The string
 * @param {string[]} sep The list of substrings
 * @returns {any}
 */
export function contain_index(s = "", sep = [""]) {
    for (let i in sep) {
        if (s.includes(sep[i])) return i;
    }
    return -1;
}

/**
 * Convert "1,2:4,-2" to [1,3,4]
 * @param {string|string[]} s The string array
 * @returns {any}
 */
export function str_to_index_list(s = []) {
    if (typeof s == "string") return str_to_index_list(split_list(s));
    else return cancel_list(flatten(s.map(str_to_index)));
}

/**
 * Remove the elements in the list that start with remove
 * @param {number[]} s The list
 * @returns {any}
 */
export function cancel_list(s = [0]) {
    let rem = s.filter(si => si < 0);
    rem = rem.map(si => Math.floor(Math.abs(si)));
    return s.filter(si => si >= 0 && !rem.includes(si));
}

/**
 * Convert "1,2:4,-2" to [1,3,4]
 * @param {string} s The string
 * @returns {any}
 */
export function str_to_index(s = "0") {
    let str = String(s).trim();
    if (str.includes(":")) {
        let split = str.split(":");
        if (str.startsWith("-")) return seq(-Math.abs(Number(split[1])), -Math.abs(Number(split[0])), 1);
        else return seq(Number(split[0]), Number(split[1]), 1);
    }
    else return [Number(str)];
}

/**
 * Check if a list contains an element
 * @param {any[]|string} list The list or string
 * @param {any|string} x An element or substring
 * @returns {any}
 */
export function contains(list = [0], x = 0) {
    return list.includes(x);
}

/**
 * Return column j
 * @param {any[][]} x The matrix
 * @param {number|number[]|string} j The col index, or list of indices
 * @returns {any}
 */
export function get_col(x = [[0]], j = 0) {
    if (typeof j == "number") return x ? x.map(s => s[j]) : [];
    else if (typeof j == "string") {
        let list = str_to_index_list(j);
        return get_col(x, list);
    }
    else if (Array.isArray(j)) {
        return x ? x.map(xi => j.map(ji => xi[ji])) : [];
    }
}

/**
 * Replace column j by y
 * @param {any[][]} x The matrix
 * @param {number|number[]|string} j The col index, or list of indices
 * @returns {any}
 */
export function set_col(x = [[0]], j = 0, y = [0]) {
    if (typeof j == "number") return x ? x.map((si, i) => si.map((sij, k) => k == j ? y[i] : sij)) : x;
    else if (typeof j == "string") {
        let list = str_to_index_list(j);
        return get_col(x, list);
    }
    else if (Array.isArray(j)) {
        return x ? x.map((si, i) => si.map((sij, k) => j.includes(k) ? y[i][j.indexOf(k)] : sij)) : x;
    }
}

export function get_ind(x = [], j = []) {
    if (!Array.isArray(j)) return get_ind(x, [j]);
    else return j.filter(ji => is_index(ji, x));
}

/**
 * Return row j
 * @param {any[][]|any[]} x The matrix
 * @param {number|number[]|string} j The row index
 * @returns {any}
 */
export function get_row(x = [[0]], j = 0) {
    if (typeof j == "number") return x ? x[j] : [];
    else if (typeof j == "string") {
        let list = str_to_index_list(j);
        return get_row(x, list);
    }
    else if (Array.isArray(j)) {
        return x ? j.map(ji => x[ji]) : [];
    }
}

/**
 * Copy vector
 * @param {any[]} from Copy from
 * @param {any[]} to Copy to
 * @returns {any}
 */
export function vec_copy_to(from = [], to = []) {
    let n = Math.min(from.length, to.length);
    for (let i = 0; i < n; i++) {
        to[i] = from[i];
    }
}

/**
 * Copy matrix
 * @param {any[][]} from Copy from
 * @param {any[][]} to Copy to
 * @returns {any}
 */
export function mat_copy_to(from = [[]], to = [[]]) {
    let n = Math.min(from.length, to.length);
    for (let i = 0; i < n; i++) {
        let m = Math.min(from[i].length, to[i].length);
        for (let j = 0; j < m; j++) {
            to[i][j] = from[i][j];
        }
    }
}

/**
 * Generate (0, 0), (0, 1), (1, 0), (1, 1)
 * @param {number} n Dimensions
 */
export function cube_corner(n = 2) {
    let list = [];
    for (let i = 0; i < Math.pow(2, n); i++) {
        let bin = i.toString(2);
        if (bin.length < n) bin = rep("0", n - bin.length).join("") + bin;
        let set = bin.split("");
        list.push(set.map(s => Number(s)));
    }
    return list;
}

/**
 * Get the unique elements in array
 * @param {any[]} x The array
 */
export function get_unique(x = [0]) {
    let nx = [];
    for (let i = x.length - 1; i >= 0; i--) {
        if (!nx.includes(x[i])) nx.push(x[i]);
    }
    return nx;
}

/**
 * The number of unique elements in array
 * @param {any[]} x The array
 */
export function count_unique(x = [0]) {
    let u = get_unique(x);
    return u.length;
}

// TODO figure out what they do
export function rand_cpt(graph = [[0]], n_class = rep(2, graph.length)) {
    let n = graph.length;
    let cpt = zero_mat(n, n, [0, 0]);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (graph[i][j] != 0) {
                cpt[i][j] = rand(0, 1, 2);
            }
        }
    }
}

export function convolution_page(xin = "x", fin = "f", out = "out") {
    let x = str_to_mat_line(get_str(xin, "", true));
    let f = str_to_mat_line(get_str(fin, "", true));
    set_str(mat_to_str_line(convolution(x, f)), out);
}

/**
 * Convolution between X o F
 * @param {number[][]} x Image
 * @param {number[][]} f Filter
 * @param {number} a Row
 * @param {number} b Column
 * @returns {any}
 */
export function convolution(x = [[0]], f = [[0]], a = -1, b = -1) {
    if (a >= 0 && b >= 0) {
        let k = (f.length - 1) / 2;
        let c = 0;
        for (let i = -k; i <= k; i++) {
            for (let j = -k; j <= k; j++) {
                c += get_ij(x, a + i, b + j, 0) * get_ij(f, k - i, k - j, 0);
            }
        }
        return c;
    }
    else {
        let c = mat_clone(x);
        for (let i = 0; i < x.length; i++) {
            for (let j = 0; j < x[i].length; j++) {
                c[i][j] = convolution(x, f, i, j);
            }
        }
        return c;
    }
}

export function pooling(x = [[0]], type = "max", n = 2) {
    let p = zero_mat(x.length / n, x[0].length / n);
    for (let i = 0; i < p.length; i++) {
        for (let j = 0; j < p[0].length; j++) {
            for (let k = 0; k < n; k++) {
                for (let l = 0; l < n; l++) {
                    if (type == "max" && k == 0 && l == 0) p[i][j] = x[n * i + k][n * j + l];
                    else if (type == "max") p[i][j] = Math.max(p[i][j], x[n * i + k][n * j + l]);
                    else p[i][j] += 1 / (n * n) * x[n * i + k][n * j + l];
                }
            }
        }
    }
    return p;
}

export function rand_zero_sum_nash(a = -10, b = 10, n = 3, m = 3, one = false) {
    let payoff = rand_int(a, b, n, m);
    let possible = [];
    let ne = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            let temp = payoff[i][j];
            payoff[i][j] = Number.POSITIVE_INFINITY;
            let min = Math.min(...get_row(payoff, i));
            payoff[i][j] = Number.NEGATIVE_INFINITY;
            let max = Math.max(...get_col(payoff, j));
            payoff[i][j] = temp;
            if (temp > max && temp < min) ne++;
            if (max < min) possible.push([i, j, max, min]);
        }
    }
    if (ne > 0) return payoff;
    else if (possible.length > 0) {
        let change = rand_elem(possible);
        payoff[change[0]][change[1]] = rand_int(change[2], change[3]);
        return payoff;
    }
    else return rand_zero_sum_nash(a, b, n, m);
}

export function nash(x = [[[0]]]) {
    let br = best_response(x);
    return br.map(bi => bi.map(bij => (bij[0] == 1 && bij[1] == 1) ? 1 : 0));
}

export function best_response(x = [[[0]]]) {
    let row = x.map(xi => xi.map(xij => xij[0]));
    let col = x.map(xi => xi.map(xij => xij[1]));
    let row_max = mat_max_by_col(row);
    let col_max = mat_max_by_row(col);
    return x.map((xi, i) => xi.map((xij, j) => [xij[0] == row_max[j] ? 1 : 0, xij[1] == col_max[i] ? 1 : 0]));
}

export function mat_max_by_col(x = [[0]]) {
    return x.reduce((s, xi) => s.map((si, i) => Math.max(si, xi[i])), x[0]);
}

export function mat_max_by_row(x = [[0]]) {
    return x.map(xi => Math.max(...xi));
}

export function mat_min_by_col(x = [[0]]) {
    return x.reduce((s, xi) => s.map((si, i) => Math.min(si, xi[i])), x[0]);
}

export function mat_min_by_row(x = [[0]]) {
    return x.map(xi => Math.min(...xi));
}

export function zero_sum_to_game(x = [[0]]) {
    return x.map(xi => xi.map(xij => [xij, -xij]));
}

/**
 * Greatest Common Divisor
 * @param {number} a A 
 * @param {number} b B
 * @returns {number}
 */
export function gcd(a = 1, b = 1) {
    return gcd_int(Math.floor(Math.abs(a)), Math.floor(Math.abs(b)));
}

/**
 * Greatest Common Divisor
 * @param {number} a A 
 * @param {number} b B
 * @returns {number} 
 */
export function gcd_int(a = 1, b = 1) {
    return b ? gcd_int(b, a % b) : a;
}

/**
 * Convert sqrt(n) to a sqrt(b)
 * @param {number} num The number 
 * @returns {number[]}
 */
export function factor_sqrt(num = 1) {
    let a = 1;
    let b = num;
    for (let i = 2; i * i <= num; i++) {
        let r = num / i / i;
        if (Number.isInteger(r)) {
            a = i;
            b = r;
        }
    }
    return [a, b];
}

/**
 * Reduce the fraction
 * @param {number} a Numerator
 * @param {number} b Denominator
 * @returns {number[]}
 */
export function factor_frac(a = 1, b = 1) {
    let sign = (a * b >= 0 ? 1 : -1);
    let g = gcd(a, b);
    return [sign * Math.abs(a / g), Math.abs(b / g)];
}

/**
 * Convert fraction to string
 * @param {number|number[]} num List of numerators
 * @param {number} sum Denominator
 * @returns {string}
 */
export function frac_to_str(num = [0], sum = 0) {
    if (is_vec(num)) {
        let total = (sum == 0 ? vec_sum(num) : sum);
        return "[" + num.reduce((s, n, i) => s + (i > 0 ? "," : "") + frac_to_str(n, total), "") + "]";
    }
    else {
        let frac = factor_frac(num, sum);
        return (frac[0] < 0 ? "- " : "") + Math.abs(frac[0]) + "/" + frac[1];
    }
}

/**
 * Convert square root to string
 * @param {number|number[]} num List of numbers
 * @returns {string}
 */
export function sqrt_to_str(num = [0]) {
    if (is_vec(num)) return "[" + num.reduce((s, n, i) => s + (i > 0 ? "," : "") + sqrt_to_str(n), "") + "]";
    else {
        let cur = factor_sqrt(num);
        return (cur[0] != 1 ? cur[0] + " " : "") + (cur[1] != 1 ? "sqrt(" + cur[1] + ")" : "");
    }
}

/**
 * Convert fraction over square root to string
 * @param {number|number[]} num List of numerators
 * @param {number} sum Denominator
 * @returns {string}
 */
export function frac_sqrt_to_str(num = [0], sum = 0) {
    if (is_vec(num)) {
        let total = (sum == 0 ? norm_sq(num, 2) : sum);
        return "[" + num.reduce((s, n, i) => s + (i > 0 ? "," : "") + frac_sqrt_to_str(n, total), "") + "]";
    }
    else {
        let cur = factor_sqrt(sum);
        let frac = (cur[0] == 1 ? [num, 1] : factor_frac(num, cur[0]));
        return (frac[0] < 0 ? "- " : "") + Math.abs(frac[0]) + "/(" + (frac[1] != 1 ? frac[1] + " " : "") + (cur[1] != 1 ? "sqrt(" + cur[1] + ")" : "") + ")";
    }
}

export function farthest_from(x = [0], s = [0]) {
    let d = x.map(xi => s.reduce((m, si) => Math.min(m, Math.abs(si - xi)), Number.MAX_VALUE));
    return x[arg_max(d)];
}

export function insert_row(x = [[0]], y = [0], i = x.length) {
    x.splice(i, 0, y);
    return x;
}

export function insert_col(x = [[0]], y = [0], i = x[0].length) {
    x.forEach((xi, j) => xi.splice(i, 0, get_i(y, j, 0)));
    return x;
}

/**
 * Find the mean
 * @param {number[]} x The x
 * @returns {number}
 */
export function mean(x = [0]) {
    return vec_sum(x) / x.length;
}

/**
 * Find the median
 * @param {number[]} x The x
 * @returns {number}
 */
export function median(x = [0]) {
    let s = arg_sort(x);
    let n = x.length;
    if (n % 2) return x[(n - 1) / 2];
    else return 0.5 * (x[n / 2] + x[n / 2 - 1]);
}

/**
 * Find the variance
 * @param {number[]} x The x
 * @param {boolean} sample Whether to use sample variance
 * @returns {number}
 */
export function variance(x = [0], sample = false) {
    let mu = mean(x);
    let m2 = x.reduce((s, xi) => s + (xi - mu) * (xi - mu), 0);
    return m2 / (x.length - (sample ? 1 : 0));
}

export function complete_binary_tree_mat(n = 2, b = 2) {
    let parent = 0;
    for (let i = 0; i < n; i++) parent += Math.pow(b, i);
    let size = parent + Math.pow(b, n);
    let mat = zero_mat(size, size, 0);
    for (let i = 0; i < parent; i++) {
        for (let j = 0; j < b; j++) mat[i][b * i + j + 1] = 1;
    }
    return mat;
}

/**
 * Check if child is a children of parent
 * @param {number} child The child
 * @param {number} parent The parent
 * @param {number[][]} tree The tree 
 * @returns 
 */
export function is_parent(child, parent, tree) {
    console.log(tree);
    for (let i = 0; i < tree.length; i++) {
        if (tree[i][child]) {
            if (i == parent) return true;
            else return is_parent(i, parent, tree);
        }
    }
    return false;
}

export function get_dominated_actions(payoff = [[[0, 0]]], dim = 0, a = 1, b = 5) {
    let n = [payoff.length, payoff[0].length];
    let act = zero_mat(n[1 - dim], 2);
    let row = rand_int(0, n[0] - 1);
    let col = rand_int(0, n[1] - 1);
    for (let i = 0; i < n[1 - dim]; i++) {
        let i0 = dim == 0 ? row : i;
        let i1 = dim == 1 ? col : i;
        act[i][dim] = payoff[i0][i1][dim] - rand_int(a, b);
        act[i][1 - dim] = payoff[i0][i1][1 - dim] + rand_sign() * rand_int(a, b);
    }
    return act;
}

export function make_dist(x = [[0]]) {
    let n = x.length;
    for (let i = 0; i < n; i++) {
        x[i][i] = 0;
        for (let j = i + 1; j < n; j++) x[i][j] = x[j][i];
    }
}

export function remove_negative_row_col(x = [[0]]) {
    let rs = row_sum(x);
    let cs = col_sum(x);
    let rows = rs.map(r => r >= 0);
    let cols = cs.map(c => c >= 0);
    return extract_row_col(x, rows, cols);
}

export function list_permutation(x = [0]) {
    let y = [];
    for (let i = 0; i < x.length; i++) {
        let rest = list_permutation(x.slice(0, i).concat(x.slice(i + 1)));
        if (!rest.length) y.push([x[i]]);
        else {
            for (let j = 0; j < rest.length; j++) y.push([x[i]].concat(rest[j]));
        }
    }
    return y;
}

export function extract_row_col(x = [[0]], r = zero_vec(x.length, true), c = zero_vec(x[0].length, true)) {
    let nx = [];
    for (let i in x) {
        if (r[i]) {
            let nxx = [];
            for (let j in x[i]) {
                if (r[i] && c[j]) nxx.push(x[i][j]);
            }
            nx.push(nxx);
        }
    }
    return nx;
}

export function classify_threshold(y = [0], t = 0) {
    let c0 = y.reduce((s, yi, i) => s + (((i <= t && yi == 0) || (i > t && yi == 1)) ? 1 : 0), 0);
    let c1 = y.reduce((s, yi, i) => s + (((i <= t && yi == 1) || (i > t && yi == 0)) ? 1 : 0), 0);
    return Math.max(c0, y.length - c0, c1, y.length - c1);
}

export function cpt_to_list(graph = [[0]], cpt = [[[0]]], name = []) {
    let n = graph.length;
    let v;
    if (name.length == n) v = name;
    else v = str_seq(0, n, 1);
    let list = [];
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (graph[i][j] != 0) {
                list.push({ name: "p" + name[i] + name[j], prob: cpt[i][j][0] });
                list.push({ name: "p" + name[i] + "n" + name[j], prob: cpt[i][j][1] });
            }
        }
    }
}

export function bayes_net_joint(graph = [[0]], cpt = [[[0]]], x = [0]) {
    let prob = 1;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (graph[i][j] != 0) {
                prob *= x[0];
            }
        }
    }
}

export function incr(x = [0, 0], j = 0, dx = 1) {
    return x.map((v, i) => i == j ? v + dx : v);
}

export function hill_climbing_step(x = [0, 0], f = (x, y) => 0) {
    let m = x.length;
    let min = f(...x);
    let arg_min = x;
    let cur_x = 0;
    let cur_f = 0;
    for (let j = 0; j < m; j++) {
        for (let k of [-1, 1]) {
            cur_x = incr(x, j, k);
            cur_f = f(...cur_x);
            if (cur_f < min) {
                arg_min = cur_x;
                min = cur_f;
            }
        }
    }
    return arg_min;
}

export function hill_climbing(x = [0, 0], f = (x, y) => 0) {
    let cur = [];
    while (cur != x) {
        cur = hill_climbing_step(x, f);
        x = cur;
    }
    return x;
}

export function genetic_cross(x1 = [0], x2 = [0], d = 0) {
    let c1 = x1.map((xi, i) => i <= d ? xi : x2[i]);
    let c2 = x2.map((xi, i) => i <= d ? xi : x1[i]);
    return [c1, c2];
}

/**
 * Find the eigenvalue and eigenvector
 * @param {number[][]} x The matrix
 * @returns {any}
 */
export function eig(x = [[0]]) {
    let ei = numeric.eig(x);
    return { value: ei.lambda.x, vector: ei.E.x };
}

/**
 * Find the singular value decomposition
 * @param {number[][]} x The matrix
 * @returns {any}
 */
export function svd(x = [[0]]) {
    return numeric.svd(x);
}

/**
 * Covariance matrix
 * @param {number[][]} x The data
 * @returns {any}
 */
export function cov(x = [[0]]) {
    let means = col_mean(x);
    let center = mat_add_vec_row(x, means, 1, -1);
    let m = x[0].length;
    let c = zero_mat(m, m);
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < m; j++) {
            if (i <= j) c[i][j] = mat_dot_cols(center, i, j);
            else c[i][j] = c[j][i];
        }
    }
    return mat_mul(c, 1 / m);
}

/**
 * Covariance matrix
 * @param {number[][]} x The data
 * @returns {any}
 */
export function pca(x = [[0]]) {
    let e = eig(cov(x));
    return e.vector;
}

export function pca_page(data = "") {
    let obj = get_canvas_objects(data);
    let x = get_mat_from_objects(obj);
    if (x.length > 1) {
        let pc = pca(x);
        let means = col_mean(x);
        for (let i = 0; i < pc.length; i++) obj.push({ type: "line", x0: means[0], y0: means[1], x1: means[0] + pc[i][0] * 100, y1: means[1] + pc[i][1] * 100 });
    }
    two_paint(data, obj);
}

export function k_means_page(data = "", cluster = "", max = "100") {
    let obj = get_canvas_objects(data);
    let x = get_mat_from_objects(obj);
    if (x.length > 1) {
        let nc = bound(round(get_num(cluster, 1), 0), 1, x.length);
        let init = [];
        let rect = get_object_by_type(obj, "rect");
        if (rect.length > 0) {
            for (let i = rect.length - 1; i >= 0; i--) {
                init.push([0.5 * (rect[i].x0 + rect[i].x1), 0.5 * (rect[i].y0 + rect[i].y1)]);
            }
        }
        let c = train_k_means(x, nc, { l: 2, initial: init, max_iter: Math.max(1, Number(max)) });
        let center = c.center;
        let y = c.cluster;
        let col = vec_to_color(y, nc);
        set_object_by_type(obj, "point", "fill", col);
        remove_object_by_type(obj, "rect");
        let cc = 10;
        let wheel = color_wheel(nc);
        center.forEach((c, i) => obj.push({ type: "rect", x0: c[0] - cc, y0: c[1] - cc, x1: c[0] + cc, y1: c[1] + cc, col: wheel[i] }));
        two_paint(data, obj);
    }
}

/**
 * K-Means Clustering
 * @param {number[][]} x The data matrix
 * @param {number} nc The number of clusters
 * @param {object} param Parameters
 * @returns {any}
 */
export function train_k_means(x = [[0]], nc = 3, param = { l: 2, initial: [], max_iter: 100 }) {
    let m = x[0].length;
    let min = col_min(x);
    let max = col_max(x);
    let c = [];
    if (param.initial && param.initial.length == nc) c = param.initial;
    else {
        for (let i = 0; i < nc; i++) {
            let ci = [];
            for (let j = 0; j < m; j++) ci.push(rand(min[j], max[j]));
            c.push(ci);
        }
    }
    let pc = [];
    let y = [];
    let n_iter = 0;
    while (n_iter < (param.max_iter || 100) && (n_iter < 1 || sum_norm(c, pc) > 0.001)) {
        pc = mat_clone(c);
        y = classify_k_means(x, c, { l: param.l || 2 });
        center_k_means(x, y, c);
        n_iter++;
    }
    return { center: c, cluster: y };
}

export function sum_norm(x = [[0]], y = [[0]], l = 2) {
    if (x.length != y.length) return 0;
    return x.reduce((s, xi, i) => s + dist(xi, y[i], l), 0);
}

export function distortion(x = [[0]], y = [0], c = [[0]], param = { l: 2 }) {
    let d = get_num(param.l, Math.min(2, x[0].length));
    return y.reduce((s, yi, i) => s + Math.pow(dist(x[i], c[yi], d), d), 0);
}

export function center_k_means(x = [[0]], y = [0], c = [[0]]) {
    let nc = c.length;
    let ct = zero_mat(nc, c[0].length);
    let cn = zero_vec(nc);
    let n = x.length;
    for (let i = 0; i < n; i++) {
        vec_copy_to(vec_add(ct[y[i]], x[i]), ct[y[i]]);
        cn[y[i]]++;
    }
    for (let i = 0; i < nc; i++) {
        if (cn[i] > 0) c[i] = vec_mul(ct[i], 1 / cn[i]);
    }
    return c;
}

export function classify_k_means(x = [[0]], c = [[0]], param = { l: 2 }) {
    return x.map(xi => classify_one_k_means_classify(xi, c, get_num(param.l, 2)));
}

export function classify_one_k_means_classify(x = [0], c = [[0]], param = { l: 2 }) {
    let d = c.map(cj => dist(x, cj, get_num(param.l, 2)));
    return arg_min(d);
}

/**
 * Clone a vector
 * @param {any[]} x The vector
 * @returns {any}
 */
export function vec_clone(x) {
    return x.slice(0);
}

/**
 * Clone a matrix
 * @param {any[][]} x The matrix
 * @returns {any}
 */
export function mat_clone(x) {
    return x.map(i => i.slice(0));
}

/**
 * Find the trace of x
 * @param {number[][]} x The matrix
 * @returns {any}
 */
export function trace(x = [[0]]) {
    return x.reduce((s, xi, i) => s + (xi[i] || 0), 0);
}

export function rand_2d_page(n = "10", field = "data") {
    let mat = rand(-1, 1, get_num(n), 2);
    set_str(mat_to_str_line(mat, 2), field);
}

export function rand_2d_norm_page(n = "10", field = "data") {
    let mat = rand_bi_norm([0, 0], [[1, rand() * 2 - 1], [0, 1]], get_num(n));
    set_str(mat_to_str_line(mat, 2), field);
}

export function rand_2d_class_page(n = "10", field = "data") {
    let mat = rand(-1, 1, get_num(n), 2);
    let pts = mat.map(m => [rand_int(0, 2), ...m]);
    set_str(mat_to_str_line(pts, 2), field);
}

export function rand_2d_sep_class_page(n = "10", field = "data") {
    let mat = rand(-1, 1, get_num(n), 2);
    let a = rand(-1, 1);
    let y = xor_label(mat, [a, 1, a > 0 ? -1 : 1]);
    let pts = mat.map((m, i) => [y[i], ...m]);
    set_str(mat_to_str_line(pts, 2), field);
}

export function load_points_page(field = "data", canvas = "canvas") {
    let str = get_str(field_name(field));
    if (str.trim() != "") {
        let mat = str_to_mat_line(str);
        let pts = mat_to_points(mat);
        scale_bounding_box(pts, get_bounding_box(pts), get_canvas_bounding_box(canvas));
        two_paint(canvas, pts);
    }
}

export function load_points_class_page(field = "data", canvas = "canvas") {
    let str = get_str(field_name(field));
    if (str.trim() != "") {
        let design = str_to_mat_line(str);
        let mat = design.map(x => [x[1] || 0, x[2] || 0]);
        let y = design.map(x => x[0] || 0);
        let pts = mat_to_points(mat, y);
        scale_bounding_box(pts, get_bounding_box(pts), get_canvas_bounding_box(canvas));
        two_paint(canvas, pts);
    }
}

/**
 * The page version of hierarchical cluster
 * @param {string} data Date field name
 * @param {string} canvas Canvas name
 * @param {string} cluster Number cluster field name
 * @returns {any}
 */
export function h_cluster_page(data = "data", canvas = "canvas", cluster = "n_cluster") {
    let obj = get_canvas_objects(data);
    let x = get_mat_from_objects(obj);
    if (x.length > 1) {
        let nc = bound(round(get_num(cluster, 1), 0), 1, x.length);
        let h = train_h_cluster(x, nc, { l: 2, method: "single" });
        let c = h.cluster;
        let t = h.tree;
        let edges = t.map((ci, i) => [...x[ci], ...x[i]]);
        let col = vec_to_color(c, x.length);
        set_object_by_type(obj, "point", "fill", col);
        remove_object_by_type(obj, "line");
        let lines = mat_to_lines(edges);
        obj.push(...lines);
        two_paint(data, obj);
        if (x.length <= 10) {
            let g = h.graph;
            let o = mat_to_tree(g, g.length - 1);
            scale_bounding_box(o, get_bounding_box(o), get_canvas_bounding_box(canvas));
            two_paint(canvas, o);
        }
    }
}

/**
 * The page version of hierarchical cluster
 * @param {string} data Date field name
 * @param {string} canvas Canvas name
 * @param {string} cluster Number cluster field name
 * @returns {any}
 */
export function h_cluster_step_page(data = "data", canvas = "canvas", cluster = "n_cluster") {
    let nc = get_num(cluster);
    let obj = get_canvas_objects(data);
    let n = count_object_by_type(obj, "point");
    if (n > 1) {
        nc = bound(nc, 1, n) - 1;
        if (nc < 1) nc = n;
        set_str(nc, cluster);
        h_cluster_page(data, canvas, nc);
    }
}

/**
 * Construct the hierarchical cluster tree
 * @param {number[][]} x The data matrix
 * @param {number} nc The number of clusters
 * @returns {any}
 */
export function train_h_cluster(x = [[0]], nc = 1, param = { l: 2, method: "single" }) {
    let distance = pair_dist(x, param.l || 2);
    let n = distance.length;
    let cluster = seq(0, n - 1, 1);
    let tree = seq(0, n - 1, 1);
    let graph = zero_mat(2 * n - nc, 2 * n - nc);
    for (let i = 0; i < n - nc; i++) h_cluster_step(distance, cluster, param.method || "single", i, graph, tree);
    cluster = map_to_rank(cluster, true, true);
    return { cluster: cluster, graph: graph, tree: tree };
}

export function get_rank(x = [0], y = 0, start = 0) {
    return x.reduce((s, xi) => s + (y > xi ? 1 : 0), start);
}

export function map_to_rank(x = [0], incr = true, unique = false) {
    let y = unique ? [... new Set(x)] : x;
    if (incr) return x.map(xi => get_rank(y, xi));
    else return x.map(xi => y.length - 1 - get_rank(y, xi));
}

/**
 * One step of hierarchical clustering
 * @param {number[][]} distance The distance matrix
 * @param {number[]} cluster The current clusters
 * @param {string} method One of single, complete
 * @param {number} iter Cluster number
 * @param {number} graph Current dendrogram
 * @returns {any}
 */
export function h_cluster_step(distance = [[0]], cluster = [0], method = "single", iter = 0, graph = [[0]], tree = [0]) {
    let ind = h_cluster_min(distance);
    let i = ind[0];
    let j = ind[1];
    let n = distance.length;
    let combine = method == "single" ? (x, y) => Math.min(x, y) : (x, y) => Math.max(x, y);
    for (let k = 0; k < n; k++) {
        distance[i][k] = k == i ? 0 : (k == j ? -1 : combine(distance[i][k], distance[j][k]));
        distance[k][i] = distance[i][k];
        distance[j][k] = -1;
        distance[k][j] = -1;
        if (cluster[k] == j) cluster[k] = i;
    }
    if (graph.length >= n + iter) {
        graph[n + iter][find_root(graph, i)] = 1;
        graph[n + iter][find_root(graph, j)] = 1;
    }
    if (tree.length == n) tree[j] = i;
}

/**
 * Find the root starting from leaf in the graph g
 * @param {*} g The graph
 * @param {*} leaf The current node
 * @param {*} traversed Traversed nodes
 * @returns {any}
 */
export function find_root(g = [[0]], leaf = 0, traversed = zero_vec(g.length)) {
    let n = g.length;
    traversed[leaf] = 1;
    for (let i = 0; i < n; i++) {
        if (g[i][leaf] > 0 && !traversed[i]) {
            return find_root(g, i, traversed);
        }
    }
    return leaf;
}

/**
 * Find the cluster with minimum distance
 * @param {number[][]} d Distance matrix
 * @returns {any}
 */
export function h_cluster_min(d = [[0]]) {
    let n = d.length;
    if (n < 2) return [0, 0];
    let min = Number.POSITIVE_INFINITY;
    let ind = [0, 0];
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (d[i][j] < min && d[i][j] >= 0) {
                min = d[i][j];
                ind = [i, j];
            }
        }
    }
    return ind;
}

/**
 * Find pairwise distance between data
 * @param {number[][]} x The data matrix
 * @param {number} l The l-norm
 * @returns {any}
 */
export function pair_dist(x = [[0]], l = 2) {
    let n = x.length;
    let d = zero_mat(n, n);
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            d[i][j] = dist(x[i], x[j], l);
            d[j][i] = d[i][j];
        }
    }
    return d;
}

/**
 * Find pairwise distance between two datasets
 * @param {number[][]|number[]} x The data matrix
 * @param {number[][]|number[]} y The data matrix
 * @param {number} l The l-norm
 * @returns {any}
 */
export function double_pair_dist(x = [], y = [], l = 2) {
    let nx = x.length;
    let ny = y.length;
    let d = zero_mat(nx, ny);
    for (let i = 0; i < nx; i ++) {
        for (let j = 0; j < ny; j++) {
            d[i][j] = dist(x[i], y[j], l);
        }
    }
    return d;
}

/**
 * The L-norm between two vectors
 * @param {number[]|number} x The first vector
 * @param {number[]|number} y The second vector
 * @param {number} l The power
 * @returns {any}
 */
export function dist(x = [0], y = [0], l = 2) {
    if (is_vec(x) && is_vec(y)) return l_norm(vec_add(x, y, 1, -1), l);
    else if (is_vec(x) && !is_vec(y)) return l_norm([x[0] - y], l);
    else if (is_vec(y) && !is_vec(x)) return l_norm([x - y[0]], l);
    else if (!is_vec(y) && !is_vec(x)) return l_norm([x - y], l);
}

/**
 * The L-norm
 * @param {number[]} x The vector
 * @param {number} l The power
 * @returns {any}
 */
export function l_norm(x = [0], l = 2) {
    if (l <= 0) return norm_sq(x, l);
    else if (l == Number.POSITIVE_INFINITY) return Math.max(...x);
    else return Math.pow(norm_sq(x, l), 1 / l);
}

/**
 * Find single or complete linkage distances
 * @param {number[][]|number[]} c1 Cluster 1
 * @param {number[][]|number[]} c2 Cluster 2
 * @param {number} l The power
 * @param {string} link Single or Double
 * @returns 
 */
export function cluster_dist(c1 = [], c2 = [], l = 2, link = "single") {
    let pair = double_pair_dist(c1, c2, l);
    return link == "single" ? mat_min(pair) : mat_max(pair);
}

/**
 * The L-norm to the power L
 * @param {number[]} x The vector
 * @param {number} l The power
 * @returns {any}
 */
export function norm_sq(x = [0], l = 2) {
    if (l <= 0) return x.reduce((s, i) => (i == 0) ? s : s + 1, 0);
    else return x.reduce((s, i) => s + Math.pow(Math.abs(i), l), 0);
}

export function dist_to_object(p = { x: 0, y: 0 }, object = { type: "none" }) {
    if (starts_with(object.type, ["line"])) return distance_from_point_to_line(p.x, p.y, object.x0, object.y0, object.x1, object.y1);
    else return -1;
}

export function right_ray_to_segment(p = { x: 0, y: 0 }, p1 = { x: 0, y: 0 }, p2 = { x: 0, y: 0 }) {
    let [x, y] = [p.x, p.y];
    let x1, y1, x2, y2;
    if (p1.y <= p2.y) [x1, y1, x2, y2] = [p1.x, p1.y, p2.x, p2.y];
    else[x1, y1, x2, y2] = [p2.x, p2.y, p1.x, p1.y];
    if (y > Math.max(y1, y2) || y < Math.min(y1, y2)) return 0;
    if (y == y1 && y == y2 && x <= Math.max(x1, x2)) return 0;
    let t = (y - y1) / (y2 - y1);
    let x_star = x1 + t * (x2 - x1);
    if (x_star >= x) return 1;
    else return 0;
}

export function point_in_polygon(p = { x: 0, y: 0 }, l = [{ x: 0, y: 0 }]) {
    let cross = l.reduce((s, c, i, a) => s + (i > 0) ? right_ray_to_segment(p, c, a[i - 1]) : 0, 0);
    return cross % 2 == 1;
}

export function organize(nx = 0, ny = 0, objects = []) {
    let adjust_size = get_size("adjust");
    let grids = objects.filter(o => starts_with(o.type, "graph-grid"));
    if (grids.length == 0) {
        objects.push({ type: "graph-grid", x: nx, y: ny, dx: 0, dy: 0, da: adjust_size, fx: 0, fy: 0 });
        return { x: nx, y: ny };
    }
    else {
        let min_adjust = { x: 0, y: 0, v: adjust_size, dx: 0, dy: 0, da: adjust_size, nx: nx, ny: ny, fx: 0, fy: 0 };
        let arg_min_adjust = -1;
        let adjust = { x: 0, y: 0, v: 0, dx: 0, dy: 0, da: adjust_size, nx: nx, ny: ny, fx: 0, fy: 0 };
        let n = grids.length;
        for (let i in grids) {
            adjust = compute_adjustment(nx, ny, grids[n - 1 - Number(i)]);
            if (adjust.v < min_adjust.v) {
                min_adjust = adjust;
                arg_min_adjust = n - 1 - Number(i);
            }
        }
        if (arg_min_adjust < 0) objects.push({ type: "graph-grid", x: nx, y: ny, dx: 0, dy: 0, da: adjust_size, fx: 0, fy: 0 });
        else {
            remove_types(objects, "graph-grid");
            for (let i in grids) {
                if (Number(i) == arg_min_adjust) objects.push({ type: "graph-grid", x: min_adjust.x, y: min_adjust.y, dx: min_adjust.dx, dy: min_adjust.dy, da: adjust_size, fx: min_adjust.fx, fy: min_adjust.fy });
                else objects.push(grids[i]);
            }
        }
        return { x: min_adjust.nx, y: min_adjust.ny };
    }
}

export function remove_types(objects = [], t = "") {
    let i = objects.length;
    let e;
    while (i--) {
        e = objects[i];
        if (starts_with(e.type, t)) objects.splice(i, 1);
    }
}

/**
 * Align to grid
 */
export function compute_adjustment(x = 0, y = 0, g = { x: 0, y: 0, dx: 0, dy: 0, da: 1, fx: 0, fy: 0 }) {
    let nx = nearest_position(x, g.x, g.dx);
    let ny = nearest_position(y, g.y, g.dy);
    let nfx = 0;
    let nfy = 0;
    if (g.dx != 0) nfx = (nx - g.x) / g.dx;
    if (g.dy != 0) nfy = (ny - g.y) / g.dy;
    if (nfx < -1 || nfx > g.fx + 1 || nfy < -1 || nfy > g.fy + 1) {
        return { nx: x, ny: y, v: g.da * 2, x: g.x, y: g.y, dx: g.dx, dy: g.dy, fx: 0, fy: 0 };
    }
    else {
        if (nfx == -1) nfx = g.fx + 1;
        else nfx = Math.max(nfx, g.fx);
        if (nfy == -1) nfy = g.fy + 1;
        else nfy = Math.max(nfy, g.fy);
    }
    let delta_x = Math.abs(nx - x);
    let delta_y = Math.abs(ny - y);
    if (g.dx == 0 && g.dy == 0) {
        if (delta_x < g.da) return { nx: nx, ny: y, v: delta_x * 2, x: Math.min(nx, g.x), y: Math.min(y, g.y), dx: 0, dy: delta_y, fx: nfx, fy: nfy + 1 };
        else if (delta_y < g.da) return { nx: x, ny: ny, v: delta_y * 2, x: Math.min(x, g.x), y: Math.min(ny, g.y), dx: delta_x, dy: g.dy, fx: nfx + 1, fy: nfy };
    }
    else if (g.dx == 0) {
        if (delta_x < g.da) return { nx: nx, ny: ny, v: delta_x + delta_y, x: Math.min(nx, g.x), y: Math.min(ny, g.y), dx: g.dx, dy: g.dy, fx: nfx, fy: nfy };
        else if (delta_y < g.da) return { nx: x, ny: ny, v: delta_y * 2, x: Math.min(x, g.x), y: Math.min(ny, g.y), dx: delta_x, dy: g.dy, fx: nfx + 1, fy: nfy };
    }
    else if (g.dy == 0) {
        if (delta_y < g.da) return { nx: nx, ny: ny, v: delta_x + delta_y, x: Math.min(nx, g.x), y: Math.min(ny, g.y), dx: g.dx, dy: g.dy, fx: nfx, fy: nfy };
        else if (delta_x < g.da) return { nx: nx, ny: y, v: delta_x * 2, x: Math.min(nx, g.x), y: Math.min(y, g.y), dx: g.dx, dy: delta_y, fx: nfx, fy: nfy + 1 };
    }
    return { nx: nx, ny: ny, v: delta_x + delta_y, x: Math.min(nx, g.x), y: Math.min(ny, g.y), dx: g.dx, dy: g.dy, fx: nfx, fy: nfy };
}

export function nearest_position(x = 1, x0 = 0, dx = 1) {
    if (dx == 0) return x0;
    else return Math.round((x - x0) * 1.0 / dx) * dx + x0;
}

export function round_to_direction(a = 0) {
    if (-45 <= a && a < 45) return 0;
    else if (-135 <= a && a < -45) return -90;
    else if (45 <= a && a < 135) return 90;
    else return 180;
}

/**
 * Find the point along a path that has the furthest distance from the line segment
 * @param {any[]} ps List of points
 * @returns {any}
 */
export function max_distance(ps) {
    let p0 = ps[0];
    let p1 = ps[ps.length - 1];
    let max_dist = -1;
    let i_max = -1;
    for (let i in ps) {
        let distance = distance_from_point_to_line(ps[i].x, ps[i].y, p0.x, p0.y, p1.x, p1.y);
        if (distance > max_dist) {
            max_dist = distance;
            i_max = Number(i);
        }
    }
    return ps[i_max];
}

/**
 * Return default epsilons: closure
 * @param {string} type 
 * @returns {any}
 */
export function get_epsilon(type = "closure") {
    if (starts_with(type, "clos")) return 10;
}

/**
 * Return default sizes: node
 * @param {string} type 
 * @returns {any}
 */
export function get_size(type = "node") {
    if (starts_with(type, "node")) return 40;
    else if (starts_with(type, "pen")) return 2;
    else if (starts_with(type, "close")) return 10;
    else if (starts_with(type, "accept")) return 4;
    else if (starts_with(type, "adj")) return 20;
    else if (starts_with(type, "latex")) return 0.4;
    else if (starts_with(type, "pt")) return 0.01;
    else if (starts_with(type, "arrow")) return 3;
}

export function select_objects(objects = [{ type: "none" }], ps = [{ x: 0, y: 0 }], id = "", name = "", param = "") {
    let v0 = find_vertex(objects, ps[0]);
    let v1 = find_vertex(objects, ps[ps.length - 1]);
    if (v0 !== undefined && v1 !== undefined) {
        let np = max_distance(ps);
        let distance = distance_from_point_to_line(np.x, np.y, v0.x, v0.y, v1.x, v1.y);
        if (v0.x == v1.x && v0.y == v1.y && distance < v0.dx) {
            v0.selected = !v0.selected;
            if (get_elem(id)) set_str("node_" + v0.id, id);
            if (get_elem(name)) set_str(v0.name, name);
        }
        else {
            let edge = objects.find(e => e.type == "edge" && e.id == v0.id + "-" + v1.id);
            if (edge) {
                edge.selected = !edge.selected;
                if (get_elem(id)) set_str("edge_" + v0.id + "_" + v1.id, id);
                if (get_elem(name)) set_str(edge.name, name);
            }
        }
    }
    let g0 = find_grid(objects, ps[0]);
    let g1 = find_grid(objects, ps[ps.length - 1]);
    if (g0 && g1 && g0.x0 == g1.x0 && g0.y0 == g1.y0 && g0.x1 == g1.x1 && g0.y1 == g1.y1 && g0.mat) {
        let copy = zero_mat(g0.mat.length, g0.mat[0].length, false);
        let thick = param ? Math.max(Number(param.substring(1)), 1) : 1;
        thick = Math.floor((thick - 1) / 2);
        for (let i = 0; i < ps.length; i++) {
            let cell = find_cell(g0, ps[i]);
            for (let j = -thick; j <= thick; j++) {
                for (let k = -thick; k <= thick; k++) {
                    copy[cell[0] + j][cell[1] + k] = true;
                }
            }
        }
        let cell = find_cell(g0, ps[ps.length - 1]);
        copy[cell[0]][cell[1]] = true;
        for (let i = 0; i < g0.mat.length; i++) {
            for (let j = 0; j < g0.mat[i].length; j++) {
                if (copy[i][j]) {
                    if (param) g0.mat[i][j] = 1;
                    else if (g0.fill) g0.mat[i][j] = (g0.mat[i][j] + 1) % g0.fill.length;
                    else g0.mat[i][j] = 1 - g0.mat[i][j];
                }
            }
        }
    }
}

export function erase_objects(objects = [{ type: "none" }], ps = [{ x: 0, y: 0 }], node = true) {
    let v0 = find_vertex(objects, ps[0]);
    let v1 = find_vertex(objects, ps[ps.length - 1]);
    if (v0 !== undefined && v1 !== undefined) {
        let np = max_distance(ps);
        let distance = distance_from_point_to_line(np.x, np.y, v0.x, v0.y, v1.x, v1.y);
        if (node && v0.x == v1.x && v0.y == v1.y && distance < v0.dx) remove_vertex(objects, v0);
        else if (v0.x != v1.x || v0.y != v1.y || distance >= Math.max(v0.dx, v1.dx)) remove_edge(objects, v0, v1);
    }
}

/**
 * Find the next possible name + index = 0, 1, 2, ... that's not in the id list
 * @param {string[]} id The list of existing ids
 * @returns {String}
 */
export function next_id(id = [""]) {
    let n = id.length;
    let i = 0;
    while (i <= n + 1) {
        if (!id.includes(String(i))) return String(i);
        i++;
    }
}

export function path_to_line(canvas, ps, sample = 1) {
    if (ps == undefined) return [];
    let first = ps.firstCurve.point1;
    let line = [{ x: first.x, y: canvas.view.viewSize.height - first.y }];
    if (sample <= 1) {
        let mid = ps.getPointAt(ps.length * 0.5);
        line.push({ x: mid.x, y: canvas.view.viewSize.height - mid.y });
    }
    else {
        for (let u = 1; u <= sample; u++) {
            let mid = ps.getPointAt(ps.length * u / (sample + 1));
            line.push({ x: mid.x, y: canvas.view.viewSize.height - mid.y });
        }
    }
    let last = ps.lastCurve.point2;
    let bd = ps.bounds;
    line.push({ x: last.x, y: canvas.view.viewSize.height - last.y, min_x: bd.left, min_y: canvas.view.viewSize.height - bd.top, max_x: bd.right, max_y: canvas.view.viewSize.height - bd.bottom });
    return line;
}

/**
 * Convert one polyline drawing to either a node or an edge and add to the list of objects
 * @param {any[]} objects List of existing objects
 * @param {any[]} ps List of points (x, y)
 * @returns {any}
 */
export function line_to_nodes(objects = [{ type: "none" }], ps = [{ x: 0, y: 0, min_x: 0, min_y: 0, max_x: 0, max_y: 0 }], node = true, edge = true) {
    let v0 = find_vertex(objects, ps[0]);
    let v1 = find_vertex(objects, ps[ps.length - 1]);
    if (node && v0 == undefined && v1 == undefined) {
        let closure_size = get_epsilon("closure");
        let node_size = get_size("node");
        let example = get_object_by_type(objects, "node");
        if (example.length) node_size = example[0].dx;
        let closed = norm_two(ps[0], ps[ps.length - 1]) < closure_size;
        let small = ps[ps.length - 1].max_x - ps[ps.length - 1].min_x < node_size * 3;
        small = small && ps[ps.length - 1].max_y - ps[ps.length - 1].min_y < node_size * 3;
        if (closed && small) {
            let ids = objects.map(o => o.id || "");
            let c_id = next_id(ids);
            let sum_x = ps.reduce((prev, cur) => prev + cur.x, 0);
            let sum_y = ps.reduce((prev, cur) => prev + cur.y, 0);
            let count = ps.length;
            let np = organize(sum_x / count, sum_y / count, objects);
            update_vertex(objects, { type: "node", x: np.x, y: np.y, dx: node_size, accept: false, initial: undefined, name: c_id, id: c_id });
        }
    }
    //else if (node && v0 == undefined && v1 != undefined) {
    //    let angle = get_angle(v1.x, v1.y, ps[0].x, ps[0].y);
    //    angle = round_to_direction(angle);
    //    update_vertex(objects, { type: "node", x: v1.x, y: v1.y, r: v1.r, accept: v1.accept, initial: angle, name: v1.name, id: v1.id });
    //}
    else if (v0 != undefined && v1 == undefined) {
        let end = ps[ps.length - 1];
        update_vertex(objects, { type: "node", x: end.x, y: end.y, dx: v0.dx, accept: v0.accept, initial: v0.initial, name: v0.name, id: v0.id, hard: v0.hard });
    }
    else if (edge && v0 != undefined && v1 != undefined) {
        let node_size = Math.max(v0.dx, v1.dx)
        let np = max_distance(ps);
        let total_dist = distance_from_point_to_line(np.x, np.y, v0.x, v0.y, v1.x, v1.y);
        if (v0.x == v1.x && v0.y == v1.y) {
            if (node && total_dist < node_size) update_vertex(objects, { type: "node", x: v0.x, y: v0.y, dx: v0.dx, accept: !v0.accept, initial: v0.initial, name: v0.name, id: v0.id });
            else if (total_dist >= node_size) {
                let angle = get_angle(v0.x, v0.y, np.x, np.y);
                angle = round_to_direction(angle);
                update_edge(objects, { type: "edge", x0: v0.x, y0: v0.y, x1: v1.x, y1: v1.y, a: angle, dx0: v0.dx * 0.5, dx1: v1.dx * 0.5, id: v0.id + "-" + v1.id, name: "" });
            }
        }
        else {
            let side = side_of_line(np.x, np.y, v0.x, v0.y, v1.x, v1.y);
            let angle = total_dist > node_size ? (side * 45) : 0;
            update_edge(objects, { type: "edge", x0: v0.x, y0: v0.y, x1: v1.x, y1: v1.y, a: angle, dx0: v0.dx * 0.5, r1: v1.dx * 0.5, id: v0.id + "-" + v1.id, name: "" });
        }
    }
}

/**
 * Return which side of the line from p0 to p1 is p on
 * @param {any} p The point
 * @param {any} p0 One point on the line
 * @param {any} p1 Another point on the line
 * @returns {any}
 */
export function side_of_line(px = 0, py = 0, p0x = 0, p0y = 0, p1x = 0, p1y = 0) {
    return Math.sign((p1x - p0x) * (py - p0y) - (p1y - p0y) * (px - p0x));
}

/**
 * Update the edge that has the same from and to nodes as p
 * @param {any[]} objects The list of objects
 * @param {any} p The point x, y position
 * @returns {any}
 */
export function update_edge(objects = [{ type: "none" }], p = { id: "" }) {
    if (p.id !== undefined) {
        let i = objects.length;
        let t = -1;
        let e;
        while (i--) {
            e = objects[i];
            if (p.id !== undefined && p.id == e.id) {
                objects.splice(i, 1, p);
                t = i;
            }
        }
        if (t < 0) objects.push(p);
    }
}

/**
 * Remove the edge that has the same from p1 to p2
 * @param {any[]} objects The list of objects
 * @param {any} p0 The point x, y position of the first node
 * @param {any} p1 The point x, y position of the second node
 * @returns {any}
 */
export function remove_edge(objects = [{ type: "none" }], p0 = { id: 0 }, p1 = { id: 0 }) {
    if (p0.id !== undefined && p1.id !== undefined) {
        let i = objects.length;
        let e;
        while (i--) {
            e = objects[i];
            if (starts_with(e.type, "edge") && p0.x == e.x0 && p1.x == e.x1 && p0.y == e.y0 && p1.y == e.y1) objects.splice(i, 1);
        }
    }
}

/**
 * Update the vertex that has the same location as p
 * @param {any[]} objects The list of objects
 * @param {any} p The point x, y position
 * @returns {any}
 */
export function update_vertex(objects = [{ type: "none" }], p = { id: 0 }) {
    if (p.id !== undefined) {
        let i = objects.length;
        let t = -1;
        let v;
        while (i--) {
            v = objects[i];
            if (starts_with(v.type, "node") && p.id == v.id) {
                objects.splice(i, 1, p);
                t = i;
            }
            if (starts_with(v.type, "edge") && v.id.startsWith(p.id + "-")) {
                v.x0 = p.x;
                v.y0 = p.y;
            }
            if (starts_with(v.type, "edge") && v.id.endsWith("-" + p.id)) {
                v.x1 = p.x;
                v.y1 = p.y;
            }
        }
        if (t < 0) objects.push(p);
    }
}

/**
 * Remove the vertex that has the same location as p
 * @param {any[]} objects The list of objects
 * @param {any} p The point x, y position
 * @returns {any}
 */
export function remove_vertex(objects = [{ type: "none" }], p = { id: 0 }) {
    if (p.id !== undefined) {
        let i = objects.length;
        let v;
        while (i--) {
            v = objects[i];
            if (starts_with(v.type, "node") && v.id == p.id) objects.splice(i, 1);
            else if (starts_with(v.type, "edge") && (v.id.startsWith(p.id + "-") || v.id.endsWith("-" + p.id))) objects.splice(i, 1);
        }
    }
}

/**
 * Find the vertex the point p is inside
 * @param {any[]} objects The list of objects
 * @param {any} p The point x, y position
 * @returns {any}
 */
export function find_vertex(objects = [{ type: "none" }], p = { x: 0, y: 0 }) {
    return objects.find(v => starts_with(v.type, "node") && dist_two(v.x, v.y, p.x, p.y) <= v.dx * 1.5);
}

/**
 * Find the grid the point p is inside
 * @param {any[]} objects The list of objects
 * @param {any} p The point x, y position
 * @returns {any}
 */
export function find_grid(objects = [{ type: "none" }], p = { x: 0, y: 0 }) {
    return objects.find(v => starts_with(v.type, "grid") && is_between(p.x, v.x0, v.x1) && is_between(p.y, v.y0, v.y1));
}

/**
 * Find the cell inside the grid the point p is inside
 * @param {any} g The grid object
 * @param {any} p The point x, y position
 * @returns {any}
 */
export function find_cell(g = { type: "grid" }, p = { x: 0, y: 0 }) {
    let n = g.mat.length;
    let m = g.mat[0].length;
    let i = bound(Math.floor(scale_to(p.y, g.y0, g.y1, 0, n)), 0, n - 1);
    let j = bound(Math.floor(scale_to(p.x, g.x0, g.x1, 0, m)), 0, m - 1);
    return [n - i - 1, j];
}

/**
 * Bound x by a and b
 * @param {*} x The number
 * @param {*} a One bound
 * @param {*} b Another bound
 * @returns {any}
 */
export function bound(x = 0, a = 0, b = 0) {
    if (a > b) return bound(x, b, a);
    else return Math.max(a, Math.min(x, b));
}

/**
 * Check if x is between a and b
 * @param {number} x The number to check
 * @param {number} a One of the bound
 * @returns {any}
 */
export function is_between(x = 0, a = 0, b = 1) {
    if (a == undefined || b == undefined || x == undefined) return false;
    if (a > b) return is_between(x, b, a);
    else return x >= a && x <= b;
}

/**
 * Create an anonymous paper canvas
 * @param {string} name The name of the canvas
 * @returns {any}
 */
export function anon_two_canvas(name = "canvas") {
    two_paint(name, []);
}

/**
 * Create an anonymous three canvas
 * @param {string} name The name of the canvas
 * @returns {any}
 */
export function anon_three_canvas(name = "canvas") {
    three_paint(name, []);
}

export function dispose_three_object(obj) {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) obj.material.dispose();
    if (obj) obj.dispose();
}

export function three_paint(name = "canvas", objects = []) {
    let scene = get_global("canvas", name);
    if (scene) refresh_paint(name, objects, [], true);
    else {
        let canvas = get_elem(name);
        let renderer = new THREE.WebGLRenderer({ canvas: canvas });
        renderer.setClearColor("white");
        scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera();
        let light = new THREE.DirectionalLight("white", 1);
        scene.add(light);
        let orbitControls = new OrbitControls(camera, renderer.domElement);
        camera.position.set(0, 0, 2 * Math.SQRT2);
        for (let o of objects) {
            if (o.type == "camera") camera.position.set(o.x, o.y, o.z);
        }
        set_global("canvas", name, -1);
        set_global("context", name, scene);
        set_canvas_objects(name, objects);
        set_canvas_lines(name, []);
        quick_refresh(scene, -1, objects);
        renderer.render(scene, camera);
        orbitControls.update();
        let keyboard = function (event) {
            let key = event.key;
            for (let o of objects) {
                if (o["key_" + key]) key_three(key, o);
            }
        }
        canvas.addEventListener("keydown", keyboard);
        let animate = function () {
            orbitControls.update();
            quick_update(scene, -1, objects);
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();
    }
}

// Graphics, Drawing
/**
 * Main drawing function
 * @param {string} name The name of the canvas
 * @param {any[]} objects The list of objects
 * @param {any[]} lines The list of raw drawing
 * @returns {any}
 */
export function two_paint(name = "canvas", objects = [], lines = []) {
    let canvas = get_global("canvas", name);
    if (canvas) refresh_paint(name, objects, lines, true);
    else {
        canvas = get_elem(name);
        let context = canvas.getContext("2d");
        let id = "@" + name + "_state";
        if (get_str(id) == "") set_str("pen", id);
        let mouse_down = false;
        let line = [];
        let state = get_str(id);
        let bd = { min_x: canvas.width, max_x: 0, min_y: canvas.height, max_y: 0 };
        context.lineWidth = 2;
        quick_refresh(context, canvas, objects, lines);
        set_global("canvas", name, canvas);
        set_global("context", name, context);
        set_canvas_lines(name, lines);
        set_canvas_objects(name, objects);
        canvas.onmousedown = function (event) {
            state = get_str(id);
            if (starts_with(state, ["pen", "auto", "edge", "point", "erase", "move", "select"])) {
                let p = get_mouse(canvas, event);
                bd = { min_x: p.x, max_x: p.x, min_y: p.y, max_y: p.y };
                line = [p];
                mouse_down = true;
                if (starts_with(state, ["pen", "auto", "edge"])) start_line(context, canvas, p.x, p.y, "black");
                else if (starts_with(state, ["point"])) start_line(context, canvas, p.x, p.y, "red");
                else if (starts_with(state, ["select", "erase"])) start_line(context, canvas, p.x, p.y, "blue");
            }
        };
        canvas.onmousemove = function (event) {
            if (mouse_down) {
                let p = get_mouse(canvas, event);
                bd = update_bound(bd, p);
                line.push(p);
                if (starts_with(state, ["pen", "auto", "edge", "point", "select", "erase"])) continue_line(context, canvas, p.x, p.y);
            }
        };
        canvas.onmouseup = function (event) {
            if (mouse_down) {
                let p = get_mouse(canvas, event);
                bd = update_bound(bd, p);
                bd.x = p.x;
                bd.y = p.y;
                if (starts_with(state, ["pen"])) bd.hide = false;
                else bd.hide = true;
                line.push(bd);
                if (starts_with(state, ["pen", "auto", "edge", "point", "select", "erase"])) end_line(context, canvas, p.x, p.y);
                if (starts_with(state, ["auto", "move", "edge"])) line_to_nodes(objects, line, !ends_with(state, ["move", "edge"]), !ends_with(state, ["move"]));
                else if (starts_with(state, "erase")) erase_objects(objects, line, !ends_with(state, ["edge"]));
                else if (starts_with(state, "select")) select_objects(objects, line, "object_id", "object_name", state.substring(6));
                else if (starts_with(state, "pen")) {
                    if (ends_with(state, "line")) {
                        if (state.includes("one")) remove_object_by_type(objects, "line");
                        objects.push({ type: "line", x0: line[0].x, y0: line[0].y, x1: bd.x, y1: bd.y });
                    }
                    lines.push(line);
                }
                line.length = 0;
                mouse_down = false;
                quick_refresh(context, canvas, objects, lines);
            }
        };
        sync_touch(canvas);
    }
}

/**
 * String encryption
 * @param {string} str The string
 * @param {number} key The key
 * @returns {any}
 */
export function gen_str(str = "", key = 13) {
    let list = str.split("");
    let char = list.map(c => c.charCodeAt(0));
    let num = char.map(c => c ^ key);
    let code = String.fromCharCode(...num);
    return code;
}

/**
 * Clears all drawings on canvas
 * @param {string} layer The name of context
 * @param {string} name The name of the canvas
 * @param {string} all Either "none" or "part" or "all"
 * @returns {any}
 */
export function clean_drawing(layer = "node", name = "canvas", all = "part") {
    if (layer == "all" || layer == "node") {
        let objects = get_canvas_objects(name);
        if (all == "all") objects.length = 0;
        else if (all == "none") deselect_object(objects);
        else remove_object_by_value(objects, "hard", false);
    }
    if (layer == "all" || layer == "pen") {
        let lines = get_canvas_lines(name);
        if (all == "all") lines.length = 0;
        else remove_object_by_value(lines, "hard", false);
    }
    refresh_paint(name);
}

/**
 * Deselect paper objects
 * @param {object[]} list The list of objects
 * @returns {any}
 */
export function deselect_object(list = []) {
    for (let o of list) {
        if (o.selected) o.selected = false;
        if (o.type == "grid") o.mat = o.mat.map(mi => mi.map(mij => 0));
    }
}

/**
 * Clears all drawing from a layer
 * @param {string} layer The name of the layer
 * @param {string} name The name of the canvas
 * @param {string} all Either "part" or "all"
 * @returns {any}
 */
export function clean_paper(layer = "", name = "canvas", all = "part") {
    clean_drawing(layer, name, all);
}

/**
 * Clears all text or drawings of an element
 * @param {string} id The name of the element
 * @returns {any}
 */
export function clean(id = "canvas") {
    let name = String(id);
    if (name.includes(";;")) name.split(";;").forEach(s => clean(s.trim()));
    let element = get_elem(name);
    let type = get_elem_type(element);
    if (starts_with(type, "input_text")) element.value = "";
    else if (starts_with(type, "input_radio")) element.checked = false;
    else if (starts_with(type, "span")) element.innerHTML = "";
    else if (starts_with(type, "canvas")) clean_drawing(name, "all");
}

/**
 * Redraws all lines and objects on canvas
 * @param {any} ctx The context of the canvas
 * @param {any} cvs The canvas object or layer
 * @param {any[]} objects The list of objects, each object has a type and other parameters
 * @param {any[]} lines The list of lines, each line has a list of points with x, y attributes
 * @returns {any}
 */
export function quick_refresh(ctx, cvs, objects = [], lines = []) {
    clear_canvas(ctx, cvs);
    if (cvs != -1) lines.forEach(l => draw_polyline(ctx, cvs, l));
    objects.forEach(o => draw_object(ctx, cvs, o));
}

/**
 * Clear the canvas
 * @param {any} ctx The context or 
 * @param {any} cvs The canvas
 * @returns {any}
 */
export function clear_canvas(ctx, cvs) {
    if (cvs == -1) {
        while (ctx.children.length > 0) ctx.remove(ctx.children[0]);
    }
    else ctx.clearRect(0, 0, cvs.width, cvs.height);
}

export function quick_update(ctx, cvs, objects = []) {
    objects.forEach(o => update_object(ctx, cvs, o));
}

/**
 * Redraws all lines and objects on canvas (for HTML Canvas, not used)
 * @param {string} name The name of the canvas
 * @param {object[]} add_obj Additional objects
 * @param {object[]} add_line Additional line
 * @param {boolean} clear Whether to remove original objects
 * @returns {any}
 */
export function refresh_paint(name = "canvas", add_obj = [], add_line = [], clear = false) {
    let canvas = get_global("canvas", name);
    let context = get_global("context", name);
    let lines = get_canvas_lines(name);
    let objects = get_canvas_objects(name);
    if (clear && add_obj.length) objects.length = 0;
    if (clear && add_line.length) lines.length = 0;
    objects.push(...add_obj);
    lines.push(...add_line);
    quick_refresh(context, canvas, objects, lines);
}

// Non-primitive polyline drawing
export function draw_polyline(ctx, cvs, lines = []) {
    if (lines.length && lines[lines.length - 1].hide == false) {
        for (let i in lines) {
            if (Number(i) == 0) start_line(ctx, cvs, lines[0].x, lines[0].y);
            else if (Number(i) == lines.length - 1) end_line(ctx, cvs, lines[lines.length - 1].x, lines[lines.length - 1].y);
            else continue_line(ctx, cvs, lines[i].x, lines[i].y);
        }
    }
}

/**
 * Main drawing function
 * @param {any} ctx The context (or layer)
 * @param {any} cvs The canvas or -1 (for THREE)
 * @param {object} o The list of objects
 * @returns {any}
 */
export function draw_object(ctx, cvs, o = {}) {
    if (cvs != -1) {
        update_two_parameters(o);
        if (starts_with(o.type, ["point", "pt", "dot", "sq"])) draw_point(ctx, cvs, o.xc, o.yc, o.dx * 0.5, o);
        else if (starts_with(o.type, ["cir", "disc"])) draw_circle(ctx, cvs, o.xc, o.yc, o.dx * 0.5, o);
        else if (starts_with(o.type, ["rect"])) draw_rectangle(ctx, cvs, o.x0, o.y0, o.x1, o.y1, o);
        else if (starts_with(o.type, ["line", "ln"])) draw_line(ctx, cvs, o.x0, o.y0, o.x1, o.y1, o);
        else if (starts_with(o.type, ["curve"])) draw_curve(ctx, cvs, o.x0, o.y0, o.a0, o.a1, o.x1, o.y1, o);
        else if (starts_with(o.type, ["quad"])) draw_quad_curve(ctx, cvs, o.x0, o.y0, o.x1, o.y1, o.x2, o.y2, o);
        else if (starts_with(o.type, ["cubic"])) draw_cube_curve(ctx, cvs, o.x0, o.y0, o.x1, o.y1, o.x2, o.y2, o.x3, o.y3, o);
        else if (starts_with(o.type, ["text", "txt", "label"])) draw_text(ctx, cvs, o.name, o.xc, o.yc);
        else if (starts_with(o.type, ["axis", "axes"])) draw_axis(ctx, cvs, o);
        else if (starts_with(o.type, ["grid"])) draw_grid(ctx, cvs, o);
        else if (starts_with(o.type, "node")) draw_node(ctx, cvs, o);
        else if (starts_with(o.type, "edge")) draw_edge(ctx, cvs, o);
    }
    else {
        update_three_parameters(o);
        if (starts_with(o.type, ["point", "pt", "dot"])) o.object = draw_point_three(ctx, cvs, o);
        else if (starts_with(o.type, ["cube", "box"])) o.object = draw_cube(ctx, cvs, o);
        else if (starts_with(o.type, ["plane"])) o.object = draw_plane(ctx, cvs, o);
        else if (starts_with(o.type, ["tube", "cylinder"])) o.object = draw_tube(ctx, cvs, o);
        else if (starts_with(o.type, ["text", "txt", "label"])) o.object = draw_text_three(ctx, cvs, o);
        else if (starts_with(o.type, ["sphere"])) o.object = draw_sphere(ctx, cvs, o);
        else if (starts_with(o.type, ["cone"])) o.object = draw_cone(ctx, cvs, o);
        else if (starts_with(o.type, ["axis", "axes"])) o.object = draw_axes(ctx, cvs, o);
    }
}

// Non-primitive grid drawing 
export function draw_grid(ctx, cvs, o) {
    let g;
    if (!o.mat) g = zero_mat(10, 10);
    else g = o.mat;
    let n = g.length;
    let m = g[0].length;
    let f;
    if (!o.fill) f = ["white", "black"];
    else f = o.fill;
    let rgb = f.map(name => str_to_rgb(name));
    let dj = Math.abs((o.x1 || 1) - (o.x0 || 0)) / m;
    let di = Math.abs((o.y1 || 1) - (o.y0 || 0)) / n;
    let mj = Math.min((o.x1 || 1), (o.x0 || 0));
    let mi = Math.min((o.y1 || 1), (o.y0 || 0));
    for (let j = 0; j < m; j++) {
        for (let i = 0; i < n; i++) {
            let ij = get_ij(g, i, j);
            let color;
            if (Number.isInteger(ij)) color = f[get_ij(g, i, j)] || f[0];
            else {
                let mix = ij - Math.floor(ij);
                let rgb_mix = vec_add(rgb[Math.floor(ij)] || rgb[0], rgb[Math.ceil(ij)] || rgb[0], 1 - mix, mix);
                color = combine_str(rgb_mix, ",", "rgb(", ")", 1);
            }
            draw_rectangle(ctx, cvs, mj + j * dj, mi + (n - i - 1) * di, mj + (j + 1) * dj, mi + (n - i) * di, { c0: o.c0 || "", c1: color });
        }
    }
    draw_text_list(ctx, cvs, o);
}

// Non-primitive text list drawing
export function draw_text_list(ctx, cvs, o) {
    let bounds = get_bounding_box(o);
    if (o.x_lab) {
        if (!is_vec(o.x_lab)) o.x_lab = [String(o.x_lab)];
        let dx = (bounds.max_x - bounds.min_x) / o.x_lab.length;
        o.x_lab.forEach((xi, i) => draw_text(ctx, cvs, String(xi), bounds.min_x + (Number(i) + 0.5) * dx, bounds.min_y - o.dy0, { c0: o.c0 }));
    }
    if (o.y_lab) {
        if (!is_vec(o.y_lab)) o.y_lab = [String(o.y_lab)];
        let dy = (bounds.max_y - bounds.min_y) / o.y_lab.length;
        o.y_lab.forEach((yi, i) => draw_text(ctx, cvs, String(yi), bounds.min_x - o.dx0, bounds.min_y + (Number(i) + 0.5) * dy, { c0: o.c0 }));
    }
}

// Non-primitive edge drawing
export function draw_edge(ctx, cvs, e) {
    let name = get_str(e.name);
    let col = e.col || "black";
    if (e.selected) col = "red";
    if (e.x0 == e.x1 && e.y0 == e.y1) {
        draw_curve_offset(ctx, cvs, e.x0, e.y0, e.a + 0.5 * 45, e.a - 0.5 * 45, e.x1, e.y1, e.dx0, e.dx0, { ar: "->", c0: col });
        draw_text(ctx, cvs, to_subscript(name), e.x0 + 3 * e.dx0 * Math.cos(deg_to_rad(e.a)), e.y0 + 3 * e.dx0 * Math.sin(deg_to_rad(e.a)), { dx: 0.75 * e.dx0 });
    }
    else if (e.a == 0) {
        let angle = deg_to_rad(get_angle(e.x0, e.y0, e.x1, e.y1));
        draw_line_offset(ctx, cvs, e.x0, e.y0, e.x1, e.y1, e.dx0, e.dx1, { ar: "->", c0: col });
        draw_text(ctx, cvs, to_subscript(name), 0.5 * (e.x0 + e.x1) - e.dx0 * Math.sin(angle), 0.5 * (e.y0 + e.y1) + e.dx0 * Math.cos(angle), { dx: 0.75 * e.dx0 });
    }
    else {
        let angle_deg = get_angle(e.x0, e.y0, e.x1, e.y1);
        let angle = deg_to_rad(angle_deg);
        let distance = 0.75 * e.dx0;
        let curve = draw_curve_offset(ctx, cvs, e.x0, e.y0, angle_deg + e.a, 180 + angle_deg - e.a, e.x1, e.y1, e.dx0, e.dx1, { ar: "->", c0: col });
        let mid = bezier_at(curve, 0.5);
        draw_text(ctx, cvs, to_subscript(name), mid.x - distance * Math.sin(angle), mid.y + distance * Math.cos(angle), { dx: 0.75 * e.dx0 });
    }
}

export function lerp(p0 = { x: 0, y: 0 }, p1 = { x: 1, y: 1 }, u = 0.5) {
    return ({ x: p0.x * (1 - u) + p1.x * u, y: p0.y * (1 - u) + p1.y * u });
}

export function bezier_at(list = [], u = 0.5) {
    let n = list.length;
    let next = [];
    for (let i = 0; i < n - 1; i++) next.push(lerp(list[i], list[i + 1], u));
    if (next.length == 1) return (next[0]);
    else return bezier_at(next, u);
}

// Non-primitive node drawing
export function draw_node(ctx, cvs, v) {
    if (v.selected) draw_circle(ctx, cvs, v.xc, v.yc, v.dx * 0.5, { c0: v.c0 || "black", c1: "red" });
    else draw_circle(ctx, cvs, v.xc, v.yc, v.dx * 0.5, { c0: v.c0 || "black", c1: "" });
    draw_text(ctx, cvs, to_subscript(get_str(v.name)), v.xc, v.yc, { dx: v.dx * 0.5 });
    if (v.accept) draw_circle(ctx, cvs, v.xc, v.yc, v.dx * 0.5 - get_size("accept"), { c0: v.c0 || "black", c1: "" });
    if (v.initial !== undefined) {
        let nx = v.xc + Math.cos(deg_to_rad(v.initial)) * v.dx * 0.5 * 3;
        let ny = v.yc + Math.sin(deg_to_rad(v.initial)) * v.dx * 0.5 * 3;
        draw_line_offset(ctx, cvs, nx, ny, v.xc, v.yc, 0, v.dx * 0.5, { ar: "->" });
    }
}

/**
 * Create fake subscript characters
 * @param {string} s String with one _
 * @returns {any}
 */
export function to_subscript(s = "") {
    if (s.indexOf("_") >= 0) {
        let list = s.split("_");
        let input = list[1];
        let out = list[0];
        for (let i in input) out += String.fromCharCode(8272 + input.charCodeAt(i));
        return out;
    }
    else if (s.indexOf("->") >= 0) {
        let list = s.split("->");
        return list[0] + String.fromCharCode(8594) + list[1];
    }
    else return s;
}

/**
 * Generate an n xx m matrix filled with x
 * @param {number|string} x The number or string to fill
 * @param {number} n Number of rows
 * @param {number} m Number of columns
 * @returns {any[]}
 */
export function rep(x = 0, n = 2, m = 0) {
    if (m <= 0 && n <= 0) return [];
    else if (m <= 0) return Array(n).fill(x);
    else return Array(n).fill().map(() => Array(m).fill(x));
}

/**
 * Convert from n x 2 matrix to a list of points
 * @param {number[][]} pt List of points
 * @param {number[]} y List of labels from 0 to number of classes - 1
 * @param {string} idp The ids will be id0, id1, ...
 * @param {string[]} name List of names
 * @param {string|string[]} color List of colors
 * @param {string|string[]} shape List of shapes (cir or rect)
 * @param {number|number[]} size List of sizes
 * @param {string} stroke Stroke color
 * @returns {object[]}
 */
export function mat_to_points(pt = [[0]], y = [0], idp = "p", name = [], color = [], shape = [], size = [], stroke = "") {
    let m = n_cat(y) || 1;
    let wheel = (color.length == m ? color : (y.length == pt.length ? color_wheel(m) : []));
    let base = (typeof size == "number" ? size : get_size("pt"));
    if (base < 1) base *= Math.max(...range_by_col(pt));
    return pt.map((p, i) => ({
        type: "point",
        shape: get_i(shape, i, "circ"),
        x: p[0],
        y: p[1] || 0,
        z: p[2] || 0,
        r: get_i(size, i, 1) * base,
        name: get_i(name, i, ""),
        class: get_i(y, i, 0),
        col: stroke,
        fill: (color.length == m ? get_color_from_class(y[i], wheel, "") : get_i(color, i, "") || get_color_from_class(y[i], wheel, "")),
        id: idp + i
    }));
}

/**
 * Get color from class
 * @param {number|number[]} y The class
 * @param {string[]} wheel The list of colors one for each class
 * @param {string} def The default color
 * @returns {string}
 */
export function get_color_from_class(y = 0, wheel = [], def = "") {
    if (is_vec(y)) {
        let c_class = arg_max(y);
        let color = str_to_hsl(wheel[c_class]);
        color[1] = Math.floor(y[c_class] * 100);
        return hsl_to_str(color);
    } else {
        let c_class = get_num(y, 0);
        let m = wheel.length;
        if (m > 0 && Number.isInteger(c_class)) return wheel[c_class];
        else if (m > 0) return class_to_color(c_class, m);
        else return def;
    }
}

/**
 * Create list of rectangle grid
 * @param {number[][]|number[][][]} y The colors
 * @param {object|number[][]} bounds The boundary of the large rectangle
 * @param {string} idp The ids will be id0,0, id0,1, ...
 * @param {string[][]} name The names of each element
 * @param {string[][]|string[]|string} color The colors of each element
 * @returns {object[]}
 */
export function mat_to_grid(y = [[0]], bounds = { min_x: 0, max_x: 1, min_y: 0, max_y: 1 }, idp = "m", name = [[]], color = [[]]) {
    let m = is_a3(y) ? y[0][0].length : n_cat(y);
    let wheel = (color.length == m ? color : color_wheel(m));
    if (is_mat(bounds)) bounds = to_bound(bounds);
    let x0 = bounds.min_x;
    let y0 = bounds.min_y;
    let dx = (bounds.max_x - bounds.min_x) / y.length;
    let dy = (bounds.max_y - bounds.min_y) / y.length;
    let list = [];
    y.forEach((yi, i) => list.push(...yi.map((yij, j) => ({
        type: "rect",
        x0: x0 + i * dx,
        y0: y0 + j * dy,
        x1: x0 + (i + 1) * dx,
        y1: y0 + (j + 1) * dy,
        name: get_ij(name, i, j, ""),
        class: get_ij(y, i, j, 0),
        col: "",
        fill: ((is_a3(y) || color.length == m) ? get_color_from_class(yij, wheel) : get_ij(color, i, j, "") || get_color_from_class(yij, wheel)),
        id: idp + i + "," + j
    }))));
    return list;
}

/**
 * Create list of lines TODO Fix this
 * @param {number[][]} x Each row is a line
 * @param {string} idp The ids will be id0,0, id0,1, ...
 * @param {string[][]} color The colors of each element
 * @returns {any}
 */
export function mat_to_lines(x = [[0]], idp = "l", color = [[]]) {
    let list = [];
    for (let i = 0; i < x.length; i++) {
        for (let j = 0; j < x[i].length / 2 - 1; j++) {
            list.push({ type: "line", x0: x[i][2 * j + 0], y0: x[i][2 * j + 1], x1: x[i][2 * j + 2], y1: x[i][2 * j + 3], col: get_str(get_i(color, i)), id: idp + i });
        }
    }
    return list;
}

/**
 * Get an element of a 3D array
 * @param {any} x Any array
 * @param {number|string} i Row number
 * @param {number|string} j Column number
 * @param {number|string} k Element number
 * @returns {any}
 */
export function get_ijk(x = [[[0]]], i = 0, j = 0, k = 0, def = undefined, force = false) {
    return get_i(get_i(get_i(x, i, def, force), j, def, force), k, def, force);
}

/**
 * Get an element of a 2D array
 * @param {any} x Any array
 * @param {number|string} i Row number
 * @param {number|string} j Column number
 * @returns {any}
 */
export function get_ij(x = [[0]], i = 0, j = 0, def = undefined, force = false) {
    return get_i(get_i(x, i, def, force), j, def, force);
}

/**
 * Get an element of a 1D array
 * @param {any} x Any array
 * @param {number|string} i Row number
 * @returns {any}
 */
export function get_i(x = [0], i = 0, def = undefined, force = false) {
    let ind = (force && typeof i == "number") ? to_index(i, x) : i;
    if (typeof x == "string" && typeof def == "string") return x;
    else if (typeof x == "number" && typeof def == "number") return x;
    else return (x != undefined ? (x[ind] != undefined ? x[ind] : (typeof x == typeof def ? x : def)) : def);
}

/**
 * Force a number to index of a list
 * @param {number} n The index
 * @param {any[]} list The list
 * @returns {number}
 */
export function to_index(n = 0, list = []) {
    let len = list.length;
    return (len && len > 0) ? ((~~n) % len + len) % len : 0;
}

/**
 * Redirect the edges so that parents point to children
 * @param {number[][]} g The graph
 * @param {number} root The root
 * @param {number[]} traversed List of traversed nodes
 * @returns {any}
 */
export function reorder_tree(g = [[0]], root = 0, traversed = zero_vec(g.length), clean_up = true) {
    if (traversed[root] == 0) {
        traversed[root] = 1;
        let n = g.length;
        for (let i = 0; i < n; i++) {
            if (!traversed[i]) {
                if (g[i][root] > 0) {
                    g[root][i] = Math.max(g[i][root], g[root][i]);
                    g[i][root] = 0;
                }
                if (g[root][i] > 0) reorder_tree(g, i, traversed, false);
            }
        }
    }
    if (clean_up) {
        let n = g.length;
        for (let i = 0; i < n; i++) {
            if (!traversed[i]) {
                for (let j = 0; j < n; j++) {
                    g[i][j] = 0;
                    g[j][i] = 0;
                }
            }
        }
    }
}

/**
 * Convert matrix to node and edge objects
 * @param {number[][]} graph The graph
 * @param {number} root The root
 * @param {string[]} name The node labels
 * @param {string[][]} label The edge labels
 * @returns {any}
 */
export function mat_to_tree(graph = [[0]], root = 0, name = [""], label = [[""]]) {
    let depth = max_depth(graph, root);
    let n = graph.length;
    let counts = rep(-1, n, 2);
    let levels = zero_vec(n);
    reorder_tree(graph, root);
    get_counts(graph, root, counts, levels);
    let pos = zero_mat(n, 2);
    for (let i in counts) {
        if (counts[i][0] < 0) {
            pos[i][0] = Number.POSITIVE_INFINITY;
            pos[i][1] = Number.POSITIVE_INFINITY;
        }
        else {
            if (levels[counts[i][0]] == 1) pos[i][0] = 0.5;
            else pos[i][0] = counts[i][1] / (levels[counts[i][0]] - 1);
            pos[i][1] = (depth - counts[i][0]) / depth;
        }
    }
    pos = mat_add(pos, zero_mat(n, n, 1), 2, -1);
    return mat_to_digraph(graph, name, label, pos);
}

/**
 * The helper   export function to find the ordering of a (spanning) tree
 * @param {number[][]} graph The graph
 * @param {number} root The root
 * @param {number} level The current level
 * @param {number[][]} counts The current count (level, count)
 * @param {number[]} levels The current number of nodes in each level
 * @param {boolean[]} traversed The nodes already counted
 * @returns {any}
 */
export function get_counts(graph = [[0]], root = 0, counts = rep(-1, graph.length, 2), levels = zero_vec(graph.length), level = 0, traversed = zero_vec(graph.length)) {
    if (level <= 0) {
        for (let i = 0; i < graph.length; i++) {
            counts[i][0] = -1;
            levels[i] = 0;
        }
        counts[root][0] = 0;
        counts[root][1] = 1;
        levels[level] = 1;
        get_counts(graph, root, counts, levels, 1, traversed);
    }
    else {
        for (let c in graph[root]) {
            if (graph[root][c] > 0 && !traversed[c]) {
                traversed[c] = true;
                counts[c][0] = level;
                counts[c][1] = levels[level];
                levels[level]++;
                get_counts(graph, c, counts, levels, level + 1, traversed);
            }
        }
    }
}

/**
 * The helper   export function to find the ordering of a (spanning) tree
 * @param {number[][]} graph The graph
 * @param {number} root The root
 * @param {boolean[]} traversed The nodes already counted
 * @returns {any}
 */
export function max_depth(graph = [[0]], root = 0, traversed = zero_vec(graph.length)) {
    let max = 0;
    for (let c in graph[root]) {
        if (graph[root][c] > 0 && !traversed[c]) {
            traversed[c] = true;
            max = Math.max(max, max_depth(graph, c, traversed) + 1);
        }
    }
    return max;
}

/**
 * Generate hidden Markov model diagram
 * @param {number[]|string[]} initial
 * @param {number[][]|string[][]} transition
 * @param {number[][]|string[][]} observation
 * @returns {any}
 */
export function prob_to_hmm(initial = [], transition = [[]], observation = [[]]) {
    let nt = transition.length;
    let no = observation[0].length;
    let total = 1 + nt + nt * no;
    let graph = zero_mat(total, total);
    let names = zero_vec(total, "");
    let pos = zero_vec(total);
    names[0] = "i_0";
    pos[0] = [0.5, 1];
    for (let i = 0; i < nt; i++) {
        graph[0][1 + i] = initial[i];
        names[i + 1] = "s_" + i;
        pos[i + 1] = [i / (nt - 1), 0.5];
    }
    for (let i = 0; i < nt; i++) {
        for (let j = 0; j < nt; j++) graph[1 + i][1 + j] = transition[i][j];
    }
    for (let i = 0; i < nt; i++) {
        for (let j = 0; j < no; j++) {
            graph[1 + i][1 + nt + no * i + j] = observation[i][j];
            names[1 + nt + no * i + j] = "o_" + j;
            pos[1 + nt + no * i + j] = [(no * i + j) / (nt * no - 1), 0];
        }
    }
    pos = pos.map(pi => [pi[0] * 2 - 1, pi[1] * 2 - 1]);
    return mat_to_digraph(graph, names, graph, pos);
}

/**
 * Generate neural network diagram
 * @param {number[][][]|string[][][]} weights The neural networks 
 * @returns {any}
 */
export function weights_to_nn(weights = [[[]]], thickness = false) {
    let layer = weights.length;
    let units = weights.map(w => w[0].length + 1);
    units.unshift(weights[0].length);
    units[units.length - 1]--;
    let total = vec_sum(units);
    let graph = zero_mat(total, total);
    let label = zero_mat(total, total, "");
    let names = zero_vec(total, "");
    let pos = zero_vec(total);
    let c_total = 0;
    for (let i = 0; i < units[0]; i++) {
        names[i] = "x_" + (i + 1);
        pos[i] = [0, i / (units[0] - 1)];
    }
    names[units[0] - 1] = "1";
    for (let i = 0; i < layer; i++) {
        let cu = c_total + units[i];
        for (let j = 0; j < units[i + 1]; j++) {
            for (let k = 0; k < units[i]; k++) {
                if (i == layer - 1 || j < units[i + 1] - 1) {
                    let cx = c_total + k;
                    let cy = cu + j;
                    graph[cx][cy] = 1;
                    label[cx][cy] = String(get_ij(weights[i], k, j));
                }
            }
            names[cu + j] = (i == layer - 1 ? "o_" : "h_") + (j + 1);
            pos[cu + j] = [i + 1, units[i + 1] > 1 ? j / (units[i + 1] - 1) : 0.5];
        }
        if (i < layer - 1) names[cu + units[i + 1] - 1] = "1";
        c_total += units[i];
    }
    return mat_to_digraph(graph, names, label, pos);
}

/**
 * Convert the adjacency matrix to a list of nodes and edges
 * @param {number[][]} graph The adjacency matrix: from ROW to COL
 * @param {string[]} name The names of the nodes
 * @param {string[][]} label The names of edges
 * @param {number[][]} pos The positions of the nodes
 * @returns {any}
 */
export function mat_to_digraph(graph = [[0]], name = [""], label = [[""]], pos = [[0, 0]]) {
    let list = [];
    let cr = 0.1;
    let n = graph.length;
    let cx = 0;
    let cy = 0;
    let x = [];
    let y = [];
    let id = [];
    for (let i = 0; i < n; i++) {
        if (pos.length == n) {
            cx = pos[i][0];
            cy = pos[i][1];
        }
        else {
            let ca = 2 * Math.PI * i / n;
            cx = Math.cos(ca);
            cy = Math.sin(ca);
        }
        x.push(cx);
        y.push(cy);
        id.push(String(i));
        if (isFinite(cx) && isFinite(cy)) list.push({ type: "node", x: cx, y: cy, r: cr, name: get_str(name[i], "" + i), id: String(i) });
    }
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (graph[i][j] > 0 && isFinite(x[i]) && isFinite(y[i])) {
                let angle = 0;
                if (i == j) angle = 90;
                else if (graph[j][i] > 0) angle = 45;
                list.push({ type: "edge", x0: x[i], y0: y[i], x1: x[j], y1: y[j], a: angle, r0: cr, r1: cr, id: id[i] + "-" + id[j], name: get_str(get_ij(label, i, j)) });
            }
        }
    }
    return list;
}

export function update_bound(bd, p) {
    return { min_x: Math.min(bd.min_x, p.x), max_x: Math.max(bd.max_x, p.x), min_y: Math.min(bd.min_y, p.y), max_y: Math.max(bd.max_y, p.y) };
}

export function line_intersection(ax = 0, ay = 1, bx = 0, by = 0, cx = 0, cy = 1, dx = 1, dy = 0) {
    let sx = bx - ax;
    let sy = by - ay;
    let tx = dx - cx;
    let ty = dy - cy;
    let den = - tx * sy + sx * ty;
    let s = (- sy * (ax - cx) + sx * (ay - cy)) / den;
    let t = (tx * (ay - cy) - ty * (ax - cx)) / den;
    return s >= 0 && s <= 1 && t >= 0 && t <= 1;
}

// Graphics, Canvas
export function draw_image_fast(ctx, cvs, im = new Image(), x0 = 0, y0 = 0, x1 = 0, y1 = 0) {
    ctx.save();
    ctx.drawImage(im, x0, cvs.height - y0, x1 - x0, y0 - y1);
    ctx.restore();
}

export function draw_image(ctx, cvs, img = "", x0 = 0, y0 = 0, x1 = 0, y1 = 0) {
    ctx.save();
    if (img != "") {
        let im = new Image();
        im.src = img;
        ctx.drawImage(im, x0, cvs.height - y0, x1 - x0, y0 - y1);
    }
    ctx.restore();
}

/**
 * Draw a text, primitive
 * @param {any} ctx The context of the canvas
 * @param {any} cvs The canvas element
 * @param {number} x0 The x value of the center
 * @param {number} y0 The y value of the center
 * @param {object} param The item
 * @returns {any}
 */
export function draw_text(ctx, cvs, s = "", x0 = 0, y0 = 0, param = { dx: 20, c0: "" }) {
    if (cvs instanceof HTMLCanvasElement) {
        ctx.save();
        ctx.font = "" + Math.abs(param.dx || 20) + "px Latin Modern";
        ctx.fillStyle = param.c0;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(s, x0, cvs.height - y0);
        ctx.restore();
    }
}

/**
 * Draw a circle, primitive
 * @param {any} ctx The context of the canvas
 * @param {any} cvs The canvas element
 * @param {number} x0 The x value of the center
 * @param {number} y0 The y value of the center
 * @param {number} r0 The radius
 * @param {object} param The item
 * @returns {any}
 */
export function draw_circle(ctx, cvs, x0 = 0, y0 = 0, r0 = 1, param = { c0: "black", c1: "", t0: 1 }) {
    if (cvs instanceof HTMLCanvasElement) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x0, cvs.height - y0, r0, 0, 2 * Math.PI);
        if (param.t0 > 1) ctx.lineWidth = param.t0;
        if (param.c1 && param.c1 != "") {
            ctx.fillStyle = param.c1;
            ctx.fill();
        }
        if (param.c0 && param.c0 != "") {
            ctx.strokeStyle = param.c0;
            ctx.stroke();
        }
        ctx.restore();
    }
}

/**
 * Draw a triangle, primitive
 * @param {any} ctx The context of the canvas
 * @param {any} cvs The canvas element
 * @param {number} x0 The x value of the first point
 * @param {number} y0 The y value of the first point
 * @param {number} x1 The x value of the second point
 * @param {number} y1 The y value of the second point
 * @param {number} x2 The x value of the third point
 * @param {number} y2 The y value of the third point
 * @param {object} param The item
 * @returns {any}
 */
export function draw_triangle(ctx, cvs, x0 = 0, y0 = 0, x1 = 1, y1 = 1, x2 = 0, y2 = 1, param = { c0: "", c1: "", t0: 1 }) {
    if (cvs instanceof HTMLCanvasElement) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x0, cvs.height - y0);
        ctx.lineTo(x1, cvs.height - y1);
        ctx.lineTo(x2, cvs.height - y2);
        ctx.closePath();
        ctx.lineJoin = "round";
        if (param.t0 > 1) ctx.lineWidth = param.t0;
        if (param.c1 != "") {
            ctx.fillStyle = param.c1;
            ctx.fill();
        }
        if (param.c0 != "") {
            ctx.strokeStyle = param.c0;
            ctx.stroke();
        }
        ctx.restore();
    }
}

/**
 * Draw a rectangle, primitive
 * @param {any} ctx The context of the canvas
 * @param {any} cvs The canvas element
 * @param {number} x0 The x value of the top left point
 * @param {number} y0 The y value of the top left point
 * @param {number} x1 The x value of the bottom right point
 * @param {number} y1 The y value of the bottom right point
 * @param {object} param The item
 * @returns {any}
 */
export function draw_rectangle(ctx, cvs, x0 = 0, y0 = 0, x1 = 1, y1 = 1, param = { c0: "", c1: "", t0: 1 }) {
    if (cvs instanceof HTMLCanvasElement) {
        ctx.save();
        if (param.t0 > 1) ctx.lineWidth = param.t0;
        if (param.c1 != "") {
            ctx.fillStyle = param.c1;
            ctx.fillRect(x0, cvs.height - y0, x1 - x0, y0 - y1);
        }
        if (param.c0 != "") {
            ctx.strokeStyle = param.c0;
            ctx.strokeRect(x0, cvs.height - y0, x1 - x0, y0 - y1);
        }
        ctx.restore();
    }
}

/**
 * Draw an arrow, non-primitive
 * @param {any} ctx The context of the canvas
 * @param {any} cvs The canvas element
 * @param {object} o The object
 */
export function draw_axis(ctx, cvs, o) {
    if (o.x0 != o.x1) {
        draw_line(ctx, cvs, o.x0, o.y0, o.x1, o.y1, o);
        draw_arrow_head(ctx, cvs, o.x0, o.y0, o.x1, o.y1, o);
    }
    if (o.y0 != o.y1) {
        draw_line(ctx, cvs, o.x0, o.y0, o.x1, o.y1, o);
        draw_arrow_head(ctx, cvs, o.x0, o.y0, o.x1, o.y1, o);
    }
}

/**
 * Draw a point, non-primitive
 * @param {any} ctx The context of the canvas
 * @param {any} cvs The canvas element
 * @param {number} x The x value of the top left point
 * @param {number} y The y value of the top left point
 * @param {number} r The size
 * @param {object} param The item
 * @returns {any}
 */
export function draw_point(ctx, cvs, x = 0, y = 0, r = 1, param = { c0: "", c1: "", t0: 1 }) {
    let shape = param.shape || "cir";
    if (starts_with(shape, ["cir", "disc", "o"])) draw_circle(ctx, cvs, x, y, r, param);
    else if (starts_with(shape, ["rect", "sq"])) draw_rectangle(ctx, cvs, x - r, y - r, x + r, y + r, param);
    else draw_text(ctx, cvs, shape, x, y, param);
}

/**
 * Update 2D Canvas (or paper) parameters
 * @param {object} o Objects
 * @returns {any}
 */
export function update_two_parameters(o) {
    if (!o.updated_parameters) {
        if (Array.isArray(o.x0)) {
            o.y0 = o.x0[1];
            o.x0 = o.x0[0];
        }
        if (Array.isArray(o.x1)) {
            o.y1 = o.x1[1];
            o.x1 = o.x1[0];
        }
        o.x0 = get_num([o.x0, get_i(o.xy, 0, null)], 0);
        o.x1 = get_num([o.x1, get_i(o.xy, 2, null)], 1);
        o.y0 = get_num([o.y0, get_i(o.xy, 1, null)], 0);
        o.y1 = get_num([o.y1, get_i(o.xy, 3, null)], 1);
        o.xc = get_num([o.x, o.xc], 0.5 * (o.x0 + o.x1));
        o.yc = get_num([o.y, o.yc], 0.5 * (o.y0 + o.y1));
        o.dx = get_num([o.dx, o.size], get_num([o.r], 0.5 * (o.x1 - o.x0)) * 2);
        o.dy = get_num([o.dy, o.size], get_num([o.r], 0.5 * (o.y1 - o.y0)) * 2);
        o.x0 = o.xc - o.dx * 0.5;
        o.x1 = o.xc + o.dx * 0.5;
        o.y0 = o.yc - o.dy * 0.5;
        o.y1 = o.yc + o.dy * 0.5;
        o.x = o.xc;
        o.y = o.yc;
        o.sx = get_num([o.sx], 1);
        o.sy = get_num([o.sy], 1);
        o.l = get_num(Math.sqrt(o.dx * o.dx + o.dy * o.dy), 1);
        o.a0 = get_num([o.a0, o.ang0], 0);
        o.a1 = get_num([o.a1, o.ang1], Math.PI * 2);
        o.a = get_num([o.a, o.ang], o.a1 - o.a0);
        o.c0 = get_str([o.stroke, o.c0, o.col, o.color], "");
        o.c1 = get_str([o.fill, o.c1, o.col, o.color], "");
        if (o.c0 == "" && o.c1 == "") o.c0 = "black";
        o.t0 = get_num([o.thick, o.lwd, o.t0], 2);
        o.t1 = get_num([o.thick, o.lwd, o.t1], 2);
        o.tx = get_num([o.tx], 0);
        o.ty = get_num([o.ty], 0);
        o.dx0 = get_num([o.dx0, o.r0], 0);
        o.dx1 = get_num([o.dx1, o.r1], 0);
        o.dy0 = get_num([o.dy0, o.r0], 0);
        o.dy1 = get_num([o.dy1, o.r1], 0);
        o.rc = get_num([o.rot, o.theta], 0);
        o.dra = get_num([o.spin, o.dr], 0.1);
        o.dr = get_num([o.spin, o.dr], 0);
        o.idr = o.dr != 0 ? 1 : 0;
        o.rx0 = get_num([o.rx0, get_i(o.r_xyz, 0, null)], o.x0);
        o.ry0 = get_num([o.ry0, get_i(o.r_xyz, 1, null)], o.y0);
        o.rx1 = get_num([o.rx1, get_i(o.r_xyz, 3, null)], o.x1);
        o.ry1 = get_num([o.ry1, get_i(o.r_xyz, 4, null)], o.y1);
        o.rdx = get_num([o.rdx], o.x1 - o.x0);
        o.rdy = get_num([o.rdy], o.y1 - o.y0);
        o.dta = get_num([o.speed, o.v, o.dt], 0.1);
        o.dt = get_num([o.speed, o.v, o.dt], 0);
        o.idt = o.dt != 0 ? 1 : 0;
        o.tc = 0;
        o.tx0 = get_num([o.tx0, get_i(o.t_xyz, 0, null)], o.x0);
        o.ty0 = get_num([o.ty0, get_i(o.t_xyz, 1, null)], o.y0);
        o.tx1 = get_num([o.tx1, get_i(o.t_xyz, 3, null)], o.x1);
        o.ty1 = get_num([o.ty1, get_i(o.t_xyz, 4, null)], o.y1);
        o.tdx = get_num([o.tdx], o.tx1 - o.tx0);
        o.tdy = get_num([o.tdy], o.ty1 - o.ty0);
        o.tl = get_num(Math.sqrt(o.tdx * o.tdx + o.tdy * o.tdy), 1);
        if (o.key_was) {
            o.key_w = "tnz";
            o.key_a = "tnx";
            o.key_s = "tpz";
            o.key_d = "tpx";
        }
        if (o.key_qe) {
            o.key_q = "rcc";
            o.key_e = "rc";
        }
        o.updated_parameters = true;
    }
}

/**
 * Update three parameters
 * @param {object} o Objects
 * @returns {any}
 */
export function update_three_parameters(o) {
    if (!o.updated_parameters) {
        if (Array.isArray(o.x0)) {
            o.y0 = o.x0[1];
            o.z0 = o.x0[2];
            o.x0 = o.x0[0];
        }
        if (Array.isArray(o.x1)) {
            o.y1 = o.x1[1];
            o.z1 = o.x1[2];
            o.x1 = o.x1[0];
        }
        o.x0 = get_num([o.x0, get_i(o.xyz, 0, null)], 0);
        o.x1 = get_num([o.x1, get_i(o.xyz, 3, null)], 1);
        o.y0 = get_num([o.y0, get_i(o.xyz, 1, null)], 0);
        o.y1 = get_num([o.y1, get_i(o.xyz, 4, null)], 1);
        o.z0 = get_num([o.z0, get_i(o.xyz, 2, null)], 0);
        o.z1 = get_num([o.z1, get_i(o.xyz, 5, null)], 1);
        o.xc = get_num([o.x, o.xc], 0.5 * (o.x0 + o.x1));
        o.yc = get_num([o.y, o.yc], 0.5 * (o.y0 + o.y1));
        o.zc = get_num([o.z, o.zc], 0.5 * (o.z0 + o.z1));
        o.dx = get_num([o.dx, o.size], get_num([o.r], 0.5 * (o.x1 - o.x0)) * 2);
        o.dy = get_num([o.dy, o.size], get_num([o.r], 0.5 * (o.y1 - o.y0)) * 2);
        o.dz = get_num([o.dz, o.size], get_num([o.r], 0.5 * (o.z1 - o.z0)) * 2);
        o.x0 = o.xc - o.dx * 0.5;
        o.x1 = o.xc + o.dx * 0.5;
        o.y0 = o.yc - o.dy * 0.5;
        o.y1 = o.yc + o.dy * 0.5;
        o.z0 = o.zc - o.dz * 0.5;
        o.z1 = o.zc + o.dz * 0.5;
        o.x = o.xc;
        o.y = o.yc;
        o.z = o.zc;
        o.sx = get_num([o.sx], 1);
        o.sy = get_num([o.sy], 1);
        o.sz = get_num([o.sz], 1);
        o.l = get_num(Math.sqrt(o.dx * o.dx + o.dy * o.dy + o.dz * o.dz), 1);
        o.a0 = get_num([o.a0, o.ang0], 0);
        o.a1 = get_num([o.a1, o.ang1], Math.PI * 2);
        o.a = get_num([o.a, o.ang], o.a1 - o.a0);
        o.wire = get_str([o.fill, o.c1], "") == "";
        o.c0 = get_str([o.stroke, o.c0, o.col, o.color], "");
        o.c1 = get_str([o.fill, o.c1, o.col, o.color], "");
        if (o.c0 == "" && o.c1 == "") o.c0 = "black";
        o.t0 = get_num([o.thick, o.lwd, o.t0], 0.02);
        o.t1 = get_num([o.thick, o.lwd, o.t1], 0.02);
        o.tx = get_num([o.tx], 0);
        o.ty = get_num([o.ty], 0);
        o.tz = get_num([o.tz], 0);
        o.r0 = get_num([o.r0, o.rot, o.theta], 0);
        o.r1 = get_num([o.r1, o.rot, o.theta], 0);
        o.rc = o.r0;
        o.dra = get_num([o.spin, o.dr], 0.1);
        o.dr = get_num([o.spin, o.dr], 0);
        o.idr = o.dr != 0 ? 1 : 0;
        o.rx0 = get_num([o.rx0, get_i(o.r_xyz, 0, null)], o.x0);
        o.ry0 = get_num([o.ry0, get_i(o.r_xyz, 1, null)], o.y0);
        o.rz0 = get_num([o.rz0, get_i(o.r_xyz, 2, null)], o.z0);
        o.rx1 = get_num([o.rx1, get_i(o.r_xyz, 3, null)], o.x1);
        o.ry1 = get_num([o.ry1, get_i(o.r_xyz, 4, null)], o.y1);
        o.rz1 = get_num([o.rz1, get_i(o.r_xyz, 5, null)], o.z1);
        o.rdx = get_num([o.rdx], o.x1 - o.x0);
        o.rdy = get_num([o.rdy], o.y1 - o.y0);
        o.rdz = get_num([o.rdz], o.z1 - o.z0);
        o.dta = get_num([o.speed, o.v, o.dt], 0.1);
        o.dt = get_num([o.speed, o.v, o.dt], 0);
        o.idt = o.dt != 0 ? 1 : 0;
        o.tc = 0;
        o.tx0 = get_num([o.tx0, get_i(o.t_xyz, 0, null)], o.x0);
        o.ty0 = get_num([o.ty0, get_i(o.t_xyz, 1, null)], o.y0);
        o.tz0 = get_num([o.tz0, get_i(o.t_xyz, 2, null)], o.z0);
        o.tx1 = get_num([o.tx1, get_i(o.t_xyz, 3, null)], o.x1);
        o.ty1 = get_num([o.ty1, get_i(o.t_xyz, 4, null)], o.y1);
        o.tz1 = get_num([o.tz1, get_i(o.t_xyz, 5, null)], o.z1);
        o.tdx = get_num([o.tdx], o.tx1 - o.tx0);
        o.tdy = get_num([o.tdy], o.ty1 - o.ty0);
        o.tdz = get_num([o.tdz], o.tz1 - o.tz0);
        o.tl = get_num(Math.sqrt(o.tdx * o.tdx + o.tdy * o.tdy + o.tdz * o.tdz), 1);
        if (o.key_was) {
            o.key_w = "tnz";
            o.key_a = "tnx";
            o.key_s = "tpz";
            o.key_d = "tpx";
        }
        if (o.key_qe) {
            o.key_q = "rcc";
            o.key_e = "rc";
        }
        o.updated_parameters = true;
    }
}

export function key_three_page(key = "", name = "", canvas = "canvas") {
    let objects = get_global("objects", canvas);
    for (let o of objects) {
        if ((name.endsWith("_") && starts_with(o.name, name)) || (name.startsWith("_") && ends_with(o.name, name)) || o.name == name) key_three(key, o);
    }
}

export function key_three(key = "", o = { type: "" }) {
    if (o.object) {
        let action = o["key_" + key.toLowerCase()];
        let factor = key == key.toLowerCase() ? 1 : 5;
        if (starts_with(action, ["stop"])) {
            o.idr = 1 - o.idr;
            o.idt = 1 - o.idt;
        }
        else if (starts_with(action, ["tpx", "mpx"])) o.object.position.x += o.dta * factor;
        else if (starts_with(action, ["tnx", "mnx"])) o.object.position.x -= o.dta * factor;
        else if (starts_with(action, ["tpy", "mpy"])) o.object.position.y += o.dta * factor;
        else if (starts_with(action, ["tny", "mny"])) o.object.position.y -= o.dta * factor;
        else if (starts_with(action, ["tpz", "mpz"])) o.object.position.z += o.dta * factor;
        else if (starts_with(action, ["tnz", "mnz"])) o.object.position.z -= o.dta * factor;
        else if (starts_with(action, ["rcc"])) o.object.rotateOnWorldAxis(vec_three(o.rx1 - o.rx0, o.ry1 - o.ry0, o.rz1 - o.rz0, true), o.dra * factor);
        else if (starts_with(action, ["rc", "rot"])) o.object.rotateOnWorldAxis(vec_three(o.rx1 - o.rx0, o.ry1 - o.ry0, o.rz1 - o.rz0, true), -o.dra * factor);
    }
}

/**
 * Draw a box, primitive
 * @param {any} ctx The context of the canvas
 * @param {any} cvs The canvas element
 * @param {any} o The object
 * @returns {any}
 */
export function draw_cube(ctx, cvs, o) {
    let group = new THREE.Group();
    let geometry = new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1);
    let material;
    if (typeof o.text == "string") o.text = rep(o.text, 8);
    if (o.text && o.text.length > 0) {
        material = [];
        for (let t of o.text) {
            if (t != "") material.push(create_material({ map: create_text_texture(t, o.c0, o.c1) }, o));
            else material.push(create_material({ color: o.c1 || o.c0 }, o));
        }
    }
    else material = create_material({ color: o.c1 || o.c0 }, o);
    if (o.wire) material.wireframe = true;
    let cube = new THREE.Mesh(geometry, material);
    cube.position.set(o.xc - o.rx0, o.yc - o.ry0, o.zc - o.rz0);
    cube.scale.set(o.dx, o.dy, o.dz);
    group.add(cube);
    group.position.set(o.rx0, o.ry0, o.rz0);
    group.setRotationFromAxisAngle(vec_three(o.rx1 - o.rx0, o.ry1 - o.ry0, o.rz1 - o.rz0, true), o.r0);
    ctx.add(group);
    return group;
}

/**
 * Draw a sphere, primitive
 * @param {any} ctx The context of the canvas
 * @param {any} cvs The canvas element
 * @param {any} o The object
 * @returns {any}
 */
export function draw_sphere(ctx, cvs, o) {
    let group = new THREE.Group();
    let geometry = new THREE.SphereBufferGeometry(1, 32, 32, 0, Math.PI * 2, o.a0, o.a);
    let material = create_material({ color: o.c1 }, o);
    if (o.wire) material.wireframe = true;
    let sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(o.xc - o.rx0, o.yc - o.ry0, o.zc - o.rz0);
    sphere.scale.set(0.5 * o.dx, 0.5 * o.dy, 0.5 * o.dz);
    sphere.rotateZ(Math.PI / 2);
    group.add(sphere);
    group.position.set(o.rx0, o.ry0, o.rz0);
    group.setRotationFromAxisAngle(vec_three(o.rx1 - o.rx0, o.ry1 - o.ry0, o.rz1 - o.rz0, true), o.r0);
    ctx.add(group);
    return group;
}

/**
 * Draw a cone, primitive
 * @param {any} ctx The context of the canvas
 * @param {any} cvs The canvas element
 * @param {any} o The object
 * @returns {any}
 */
export function draw_cone(ctx, cvs, o) {
    let group = new THREE.Group();
    let geometry = new THREE.ConeBufferGeometry(1, 1, 32, 32, false, 0, Math.PI * 2);
    let material = create_material({ color: o.c1 }, o);
    if (o.wire) material.wireframe = true;
    let cone = new THREE.Mesh(geometry, material);
    cone.position.set(o.xc - o.rx0, o.yc - o.ry0, o.zc - o.rz0);
    cone.scale.set(0.5 * o.dx, 0.5 * o.dy, 0.5 * o.dz);
    cone.rotateZ(Math.PI / 2);
    group.add(cone);
    group.position.set(o.rx0, o.ry0, o.rz0);
    group.setRotationFromAxisAngle(vec_three(o.rx1 - o.rx0, o.ry1 - o.ry0, o.rz1 - o.rz0, true), o.r0);
    ctx.add(group);
    return group;
}

/**
 * Draw a cylinder, primitive
 * @param {any} ctx The context of the canvas
 * @param {any} cvs The canvas element
 * @param {any} o The object
 * @returns {any}
 */
export function draw_tube(ctx, cvs, o) {
    let group = new THREE.Group();
    let lineGeometry = new THREE.CylinderBufferGeometry(1, 1, 1, 32, 1, false, o.a0, o.a);
    let material;
    if (typeof o.text == "string") o.text = rep(o.text, 3);
    if (o.text && o.text.length > 0) {
        material = [];
        for (let t in o.text) {
            if (o.text[t] != "") {
                if (Number(t) == 0 || o.a == Math.PI * 2) material.push(create_material({ map: create_text_texture(o.text[t], o.c0, o.c1) }, o));
                else material.push(create_material({ map: create_circle_text_texture(o.text[t], o.c0, o.c1, o.a0, o.a1) }, o));
            }
            else material.push(create_material({ color: o.c1 }, o));
        }
    }
    else material = create_material({ color: o.c1 }, o);
    let line = new THREE.Mesh(lineGeometry, material);
    line.scale.set(o.t0 * o.sx, o.l, o.t0 * o.sz);
    line.lookAt(new THREE.Vector3(o.x1 - o.x0, o.y1 - o.y0, o.z1 - o.z0));
    line.rotateX(Math.PI / 2);
    line.position.set(o.xc - o.rx0, o.yc - o.ry0, o.zc - o.rz0);
    group.add(line);
    if (o.arrow) {
        let arrowGeometry = new THREE.ConeBufferGeometry(1, 1, 32, 1);
        let arrow = new THREE.Mesh(arrowGeometry, material);
        arrow.scale.set(o.t0 * 3, o.t0 * 6, o.t0 * 3);
        arrow.lookAt(new THREE.Vector3(o.x1 - o.x0, o.y1 - o.y0, o.z1 - o.z0));
        arrow.rotateX(Math.PI / 2);
        arrow.position.set(o.x1 - o.rx0, o.y1 - o.ry0, o.z1 - o.rz0);
        group.add(arrow);
    }
    group.position.set(o.rx0, o.ry0, o.rz0);
    group.setRotationFromAxisAngle(vec_three(o.rx1 - o.rx0, o.ry1 - o.ry0, o.rz1 - o.rz0, true), o.r0);
    ctx.add(group);
    return group;
}

/**
 * Draw a text, primitive
 * @param {any} ctx The context of the canvas
 * @param {any} cvs The canvas element
 * @param {any} o The object
 * @returns {any}
 */
export function draw_text_three(ctx, cvs, o) {
    let loader = new THREE.FontLoader();
    let group = new THREE.Group();
    loader.load('helvetiker_regular.typeface.json', function (font) {
        let geometry = new THREE.TextBufferGeometry(str, { font: font, size: o.dx, height: 0 });
        let material = create_material({ color: o.color }, o);
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(o.xc - o.rx0, o.yc - o.ry0, o.zc - o.rz0);
        group.add(mesh);
        group.position.set(o.rx0, o.ry0, o.rz0);
        group.setRotationFromAxisAngle(vec_three(o.rx1 - o.rx0, o.ry1 - o.ry0, o.rz1 - o.rz0, true), o.r0);
    });
    ctx.add(group);
    return group;
}

/**
 * Draw a point, non-primitive
 * @param {any} ctx The context of the canvas
 * @param {any} cvs The canvas element
 * @param {any} o The object
 * @returns {any}
 */
export function draw_point_three(ctx, cvs, o) {
    let shape = o.shape || "cir";
    let group;
    if (starts_with(shape, ["cir", "disc", "o"])) group = draw_sphere(ctx, cvs, o);
    else if (starts_with(shape, ["rect", "sq"])) group = draw_cube(ctx, cvs, o);
    else group = draw_text_three(ctx, cvs, o);
    return group;
}

/**
 * Draw a point, non-primitive
 * @param {any} ctx The context of the canvas
 * @param {any} cvs The canvas element
 * @param {any} o The object
 * @returns {any}
 */
export function draw_plane(ctx, cvs, o) {
    let thick = 0.1;
    let size = 20;
    o.dx = size;
    o.dy = size;
    o.dz = thick;
    o.wire = false;
    let group = draw_cube(ctx, cvs, o);
    return group;
}

export function draw_axes(ctx, cvs, o) {
    draw_tube(ctx, cvs, { x1: o.x1, arrow: true });
}

export function vec_three(x = 0, y = 0, z = 0, norm = false) {
    if (!norm) return new THREE.Vector3(x, y, z);
    else {
        let n = Math.sqrt(x * x + y * y + z * z);
        if (n == 0) return new THREE.Vector3(x, y, z);
        else {
            let l = 1 / n;
            return new THREE.Vector3(x * l, y * l, z * l);
        }
    }
}

export function update_object(ctx, cvs, o = { type: "" }) {
    if (o.object) {
        if (o.idr != 0 && o.dr != 0) {
            o.object.rotateOnWorldAxis(vec_three(o.rx1 - o.rx0, o.ry1 - o.ry0, o.rz1 - o.rz0, true), o.dr);
            o.rc += o.dr;
            if ((o.r0 < o.r1 && o.rc < o.r0) || (o.r0 > o.r1 && o.rc < o.r1)) o.dr = Math.abs(o.dr);
            else if ((o.r0 < o.r1 && o.rc > o.r1) || (o.r0 > o.r1 && o.rc > o.r0)) o.dr = -Math.abs(o.dr);
        }
        if (o.idt != 0 && o.dt != 0) {
            o.object.position.x += o.dt * o.tdx / o.tl;
            o.object.position.y += o.dt * o.tdy / o.tl;
            o.object.position.z += o.dt * o.tdz / o.tl;
            o.tc += o.dt;
            if (o.tc > o.tl) o.dt = -Math.abs(o.dt);
            else if (o.tc < 0) o.dt = Math.abs(o.dt);
        }
    }
}

export function create_material(texture, o) {
    if (o.metal) {
        texture.metalness = o.metal;
        texture.shininess = o.shiny;
        return new THREE.MeshStandardMaterial(texture);
    }
    else if (o.shiny) {
        texture.shininess = o.metal;
        return new THREE.MeshPhongMaterial(texture);
    }
    else return new THREE.MeshBasicMaterial(texture);
}

export function spinner() {
    let list = [];
    list.push({ name: "camera", x: 7, y: 7, z: 7 });
    let map_z = 2;
    let map_min = 1;
    let map_max = 11;
    let height = 0.4;
    let width = 0.75;
    let thick = 0.15;
    let half = (map_max + map_min) / 2;
    for (let i = map_min; i < map_max; i++) {
        let text = rep("" + i, 8);
        list.push({ name: "map_" + i, type: "cube", x0: i - half, y0: 0, z0: map_z, x1: i - half + 1, y1: 0.1, z1: map_z + 1, col: "black", fill: "white", text: text });
    }
    list.push({ name: "top_box", type: "cube", z0: -map_z, z1: -map_z - 2, x0: -2, x1: 2, y0: 0, y1: 2, col: "black", fill: "white", text: rep(" ", 8) });
    list.push({ name: "bottom_box", type: "cube", z0: -map_z - 0.5, z1: -map_z - 2 + 0.5, x0: -2 + 1, x1: 2 - 1, y0: 2, y1: 4, col: "back", fill: "white", text: rep(" ", 8) });
    let color = ["pink", "orange", "yellow", "green", "blue", "purple"];
    for (let i = 1; i <= color.length; i++) {
        let da = Math.PI * 2 / color.length;
        list.push({ name: "spinner_" + (i + 1), type: "cylinder", z0: -map_z - 0.5, z1: -map_z - 0.4, x0: 0, x1: 0, y0: 3, y1: 3, lwd: 1, ang0: i * da, ang1: (i + 1) * da, col: "black", fill: color[i - 1], text: ["", "" + i, "" + i], spin: 0.1, key_p: "stop" });
    }
    list.push({ name: "arrow", type: "tube", y0: 4.5, y1: 4, z0: -map_z - 0.45, z1: -map_z - 0.45, x0: 0, x1: 0, arrow: true, lwd: 0.05, col: "red" });
    list.push({ name: "floor_board", type: "cube", x0: -10, x1: 10, y0: 0, y1: -0.1, z0: -map_z - 2, z1: 10, col: "black", fill: "#DEB887", text: rep(" ", 8) });
    list.push({ name: "back_board", type: "cube", x0: -10, x1: 10, y0: 0, y1: 10, z0: -map_z - 2, z1: -map_z - 2.1, col: "black", fill: "#DEB887", text: rep(" ", 8) });
    list.push({ name: "robot_head", type: "sphere", x: 0, y: height * 4 + width, z: 0, r: width, fill: "gray", shiny: 0.5, ang0: 0, ang1: Math.PI / 2 * 1.5, r_xyz: [0, 0, 0, 0, 1, 0], key_qe: "r" });
    list.push({ name: "robot_face", type: "tube", x0: -width / Math.SQRT2, y0: height * 4 + width, z0: 0, x1: width / Math.SQRT2, y1: height * 4 + width, z1: 0, color: "white", fill: "black", text: ["", "XD"], lwd: width / Math.SQRT2, r_xyz: [0, 0, 0, 0, 1, 0], key_qe: "r" });
    list.push({ name: "robot_body", type: "tube", x0: 0, x1: 0, z0: 0, z1: 0, y0: height * 2, y1: height * 4, fill: "gray", lwd: width, shiny: 0.5 });
    list.push({ name: "robot_legs", type: "tube", x0: 0, x1: 0, z0: -width, z1: width, y0: height, y1: height, sx: 2, fill: "gray", lwd: height, shiny: 0.5 });
    list.push({ name: "robot_right_arm", type: "tube", x0: 0, x1: width, z0: width + thick, z1: width + thick, y0: height * 3, y1: height * 2, fill: "gray", lwd: thick, shiny: 0.5, rx1: 0, ry1: height * 3, rz1: width + thick + 1, spin: 0.1, r1: 2 });
    list.push({ name: "robot_left_arm", type: "tube", x0: 0, x1: width, z0: -width - thick, z1: -width - thick, y0: height * 3, y1: height * 4, fill: "gray", lwd: thick, shiny: 0.5, rx1: 0, ry1: height * 3, rz1: -width - thick - 1, spin: 0.1, r1: 2 });
    for (let l of list) {
        if (l.name && l.name.startsWith("robot")) {
            l.key_was = "t";
            l.t_xyz = [0, 0, 0, 0.5, 0, 0];
        }
    }
    three_paint("canvas", list);
}

export function create_circle_text_texture(text = "", color = "black", back = "white", ang0 = 0, ang1 = 2 * Math.PI, size = 256, border = 5) {
    let canvas = document.createElement("canvas");
    canvas.height = size;
    canvas.width = size;
    let context = canvas.getContext("2d");
    context.fillStyle = color;
    context.fillRect(0, 0, size, size);
    context.fillStyle = back;
    context.beginPath();
    context.arc(size / 2, size / 2, size / 2 - border, Math.PI / 2 - ang0, Math.PI / 2 - ang1);
    context.fill();
    context.fillStyle = color;
    context.font = (size - 8 * border) / 3 + "px Comic Sans MS";
    context.textAlign = "center";
    context.textBaseline = "bottom";
    context.translate(size / 2, size / 2);
    context.rotate(Math.PI / 2 - (ang0 + ang1) / 2);
    context.translate(0, -size / 6);
    context.fillText(text, 0, 0, size);
    let texture = new THREE.CanvasTexture(canvas);
    canvas.remove();
    return texture;
}

export function create_text_texture(text = "", color = "black", back = "white", size = 256, border = 5) {
    let canvas = document.createElement("canvas");
    canvas.height = size;
    canvas.width = size;
    let context = canvas.getContext("2d");
    context.fillStyle = color;
    context.fillRect(0, 0, size, size);
    context.fillStyle = back;
    context.fillRect(border, border, size - 2 * border, size - 2 * border);
    context.fillStyle = color;
    context.font = (size - 8 * border) + "px Comic Sans MS";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, size / 2, size / 2, size);
    let texture = new THREE.CanvasTexture(canvas);
    canvas.remove();
    return texture;
}

export function hermite_at(u = 0.5, p0 = [0, 0], p1 = [1, 1], p0p = [1, 1], p1p = [1, 1]) {
    let u2 = u * u;
    let u3 = u2 * u;
    return p0.map((_, i) => (1 - 3 * u2 + 2 * u3) * p0[i] + (u - 2 * u2 + u3) * p0p[i] + (3 * u2 - 2 * u3) * p1[i] + (-u2 + u3) * p1p[i]);
}

/**
 * Start a line
 * @param {any} ctx The context of the canvas
 * @param {any} cvs The canvas element
 * @param {number} x0 The x value of the first point
 * @param {number} y0 The y value of the first point
 * @param {string} c0 The stroke color
 * @returns {any}
 */
export function start_line(ctx, cvs, x0 = 0, y0 = 0, c0 = "") {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x0, cvs.height - y0);
    if (c0 != "") ctx.strokeStyle = c0;
}

/**
 * Continue a line
 * @param {any} ctx The context of the canvas
 * @param {any} cvs The canvas element
 * @param {number} x0 The x value of the middle point
 * @param {number} y0 The y value of the middle point
 * @returns {any}
 */
export function continue_line(ctx, cvs, x0 = 0, y0 = 0) {
    ctx.lineTo(x0, cvs.height - y0);
    ctx.stroke();
}

/**
 * End a line
 * @param {any} ctx The context of the canvas
 * @param {any} cvs The canvas element
 * @param {number} x0 The x value of the last point
 * @param {number} y0 The y value of the last point
 * @returns {any}
 */
export function end_line(ctx, cvs, x0 = 0, y0 = 0) {
    ctx.lineTo(x0, cvs.height - y0);
    ctx.stroke();
    ctx.restore();
}

/**
 * Draw a line, primitive
 * @param {any} ctx The context of the canvas
 * @param {any} cvs The canvas element
 * @param {number} x0 The x value of the first point
 * @param {number} y0 The y value of the first point
 * @param {number} x1 The x value of the second point
 * @param {number} y1 The y value of the second point
 * @param {object} param The item
 * @returns {any}
 */
export function draw_line(ctx, cvs, x0 = 0, y0 = 0, x1 = 1, y1 = 1, param = { c0: "", t0: get_size("pen") }) {
    if (cvs instanceof HTMLCanvasElement) {
        ctx.save();
        if (param.c0 != "") ctx.strokeStyle = param.c0;
        if (param.t0 > 1) ctx.lineWidth = param.t0;
        ctx.beginPath();
        ctx.moveTo(x0, cvs.height - y0);
        ctx.lineTo(x1, cvs.height - y1);
        ctx.stroke();
        ctx.restore();
        return [{ x: x0, y: y0 }, { x: x1, y: y1 }];
    }
}

/**
 * Draw a line r0 away from (x0, y0) and r1 away from (x1, y1)
 * @param {any} ctx The context of the canvas
 * @param {any} cvs The canvas element
 * @param {number} x0 The x value of the first point
 * @param {number} y0 The y value of the first point
 * @param {number} x1 The x value of the second point
 * @param {number} y1 The y value of the second point
 * @param {number} r0 The offset value of the first point
 * @param {number} r1 The offset value of the second point
 * @param {object} param The item
 * @returns {any}
 */
export function draw_line_offset(ctx, cvs, x0 = 0, y0 = 0, x1 = 1, y1 = 1, r0 = 0, r1 = 0, param = { ar: "", ar0: get_size("arrow"), c0: "", t0: 1 }) {
    let dx = x0 - x1;
    let dy = y1 - y0;
    let len = dist_two(x0, y0, x1, y1);
    let tx0 = x0 - dx * r0 / len;
    let ty0 = y0 + dy * r0 / len;
    let tx1 = x1 + dx * r1 / len;
    let ty1 = y1 - dy * r1 / len;
    if (get_str([param.ar, param.arrow]).includes("<-")) draw_arrow_head(ctx, cvs, tx1, ty1, tx0, ty0, param);
    if (get_str([param.ar, param.arrow]).includes("->")) draw_arrow_head(ctx, cvs, tx0, ty0, tx1, ty1, param);
    return draw_line(ctx, cvs, tx0, ty0, tx1, ty1, param);
}

/**
 * Draw a quad curve through all points, primitive
 * @param {any} ctx The context of the canvas
 * @param {any} cvs The canvas element
 * @param {number} x0 The x value of the first point
 * @param {number} y0 The y value of the first point
 * @param {number} x1 The x value of the second point
 * @param {number} y1 The y value of the second point
 * @param {number} x2 The x value of the third point
 * @param {number} y2 The y value of the third point
 * @param {object} param The item
 * @returns {any}
 */
export function draw_quad_curve(ctx, cvs, x0 = 0, y0 = 0, x1 = 1, y1 = 1, x2 = 2, y2 = 2, param = { c0: "", t0: 1 }) {
    if (cvs instanceof HTMLCanvasElement) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x0, cvs.height - y0);
        let cx = 2 * x1 - 0.5 * x0 - 0.5 * x2;
        let cy = cvs.height - (2 * y1 - 0.5 * y0 - 0.5 * y2);
        ctx.quadraticCurveTo(cx, cy, x2, cvs.height - y2);
        if (param.c0 != "") ctx.strokeStyle = param.c0;
        ctx.stroke();
        ctx.restore();
        return [{ x: x0, y: y0 }, { x: cx, y: cvs.height - cy }, { x: x2, y: y2 }];
    }
}

/**
 * Draw a quad curve through all points, primitive
 * @param {any} ctx The context of the canvas
 * @param {any} cvs The canvas element
 * @param {number} x0 The x value of the first point
 * @param {number} y0 The y value of the first point
 * @param {number} x1 The x value of the second point
 * @param {number} y1 The y value of the second point
 * @param {number} x2 The x value of the third point
 * @param {number} y2 The y value of the third point 
 * @param {number} x3 The x value of the fourth point
 * @param {number} y3 The y value of the fourth point
 * @param {object} param The item
 * @returns {any}
 */
export function draw_cube_curve(ctx, cvs, x0 = 0, y0 = 0, x1 = 1, y1 = 1, x2 = 2, y2 = 2, x3 = 3, y3 = 3, param = { c0: "", c1: "", t0: 1 }) {
    if (cvs instanceof HTMLCanvasElement) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x0, cvs.height - y0);
        let s0 = 0.5;
        let d1 = Math.pow(Math.abs(dist_two(x0, y0, x1, y1)), s0);
        let d2 = Math.pow(Math.abs(dist_two(x1, y1, x2, y2)), s0);
        let d3 = Math.pow(Math.abs(dist_two(x2, y2, x3, y3)), s0);
        let cx1 = (d1 * d1 * x2 - d2 * d2 * x0 + (2 * d1 * d1 + 3 * d1 * d2 + d2 * d2) * x1) / (3 * d1 * (d1 + d2));
        let cy1 = cvs.height - (d1 * d1 * y2 - d2 * d2 * y0 + (2 * d1 * d1 + 3 * d1 * d2 + d2 * d2) * y1) / (3 * d1 * (d1 + d2));
        let cx2 = (d3 * d3 * x1 - d2 * d2 * x3 + (2 * d3 * d3 + 3 * d3 * d2 + d2 * d2) * x2) / (3 * d3 * (d3 + d2));
        let cy2 = cvs.height - (d3 * d3 * y1 - d2 * d2 * y3 + (2 * d3 * d3 + 3 * d3 * d2 + d2 * d2) * y2) / (3 * d3 * (d3 + d2));
        ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x3, cvs.height - y3);
        if (param.c0 != "") ctx.strokeStyle = param.c0;
        ctx.stroke();
        ctx.restore();
        return [{ x: x0, y: y0 }, { x: cx1, y: cvs.height - cy1 }, { x: cx2, y: cvs.height - cy2 }, { x: x3, y: y3 }];
    }
}

/**
 * Draw curve from (x0, y0) to (x1, y1) with angle out a0, angle in a1, and circular offset r0 and r1
 * @param {any} ctx The context of the canvas
 * @param {any} cvs The canvas element
 * @param {number} x0 The x value of the starting point
 * @param {number} y0 The y value of the starting point
 * @param {number} a0 The angle going out of the starting point in degrees
 * @param {number} a1 The angle going in to the ending point in degrees
 * @param {number} x1 The x value of the ending point
 * @param {number} y1 The y value of the ending point
 * @param {object} param The item
 * @returns {any}
 */
export function draw_curve(ctx, cvs, x0 = 0, y0 = 0, a0 = 45, a1 = 225, x1 = 1, y1 = 1, param = { ar: "", ar0: get_size("arrow"), c0: "", t0: 1 }) {
    let len = dist_two(x0, y0, x1, y1) * 0.3915;
    let ang0 = deg_to_rad(a0);
    let ang1 = deg_to_rad(a1);
    if (get_str([param.ar, param.arrow]).includes("<-")) draw_arrow_head(ctx, cvs, x0 + Math.cos(ang0), y0 + Math.sin(ang0), x0, y0, param);
    if (get_str([param.ar, param.arrow]).includes("->")) draw_arrow_head(ctx, cvs, x1 + Math.cos(ang1), y1 + Math.sin(ang1), x1, y1, param);
    if (len > 0) return draw_scaled_curve(ctx, cvs, x0, y0, a0, len, a1, len, x1, y1, param);
}

/**
 * Draw curve from (x0, y0) to (x1, y1) with angle out a0, angle in a1, primitive
 * @param {any} ctx The context of the canvas
 * @param {any} cvs The canvas element
 * @param {number} x0 The x value of the starting point
 * @param {number} y0 The y value of the starting point
 * @param {number} s0 The scale of the first angle
 * @param {number} a0 The angle going out of the starting point in degrees
 * @param {number} s1 The scale of the second angle
 * @param {number} a1 The angle going in to the ending point in degrees
 * @param {number} x1 The x value of the ending point
 * @param {number} y1 The y value of the ending point
 * @param {object} param The item
 * @returns {any}
 */
export function draw_scaled_curve(ctx, cvs, x0 = 0, y0 = 0, a0 = 45, s0 = -1, a1 = 225, s1 = -1, x1 = 1, y1 = 1, param = { c0: "", t0: 1 }) {
    if (s0 <= 0 || s1 <= 0) return draw_curve(ctx, cvs, x0, y0, a0, a1, x1, y1, param);
    else if (cvs instanceof HTMLCanvasElement) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x0, cvs.height - y0);
        let ang0 = deg_to_rad(a0);
        let ang1 = deg_to_rad(a1);
        let cx1 = x0 + s0 * Math.cos(ang0);
        let cy1 = cvs.height - y0 - s0 * Math.sin(ang0);
        let cx2 = x1 + s1 * Math.cos(ang1);
        let cy2 = cvs.height - y1 - s1 * Math.sin(ang1);
        ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x1, cvs.height - y1);
        if (param.c0 != "") ctx.strokeStyle = param.c0;
        ctx.stroke();
        ctx.restore();
        return [{ x: x0, y: y0 }, { x: cx1, y: cvs.height - cy1 }, { x: cx2, y: cvs.height - cy2 }, { x: x1, y: y1 }];;
    }
}

/**
 * Draw curve from (x0, y0) to (x1, y1) with angle out a0, angle in a1, and circular offset r0 and r1
 * @param {any} ctx The context of the canvas
 * @param {any} cvs The canvas element
 * @param {number} x0 The x value of the starting point
 * @param {number} y0 The y value of the starting point
 * @param {number} a0 The angle going out of the starting point in degrees
 * @param {number} a1 The angle going in to the ending point in degrees
 * @param {number} x1 The x value of the ending point
 * @param {number} y1 The y value of the ending point
 * @param {number} dx0 The radius of the node at the starting point
 * @param {number} dx1 The radius of the node at the ending point
 * @param {object} param The item
 * @returns {any}
 */
export function draw_curve_offset(ctx, cvs, x0 = 0, y0 = 0, a0 = 45, a1 = 225, x1 = 1, y1 = 1, dx0 = 0, dx1 = 0, param = { ar: "", ar0: get_size("arrow"), c0: "", t0: 1 }) {
    let ang0 = deg_to_rad(a0);
    let ang1 = deg_to_rad(a1);
    let tx0 = x0 + Math.cos(ang0) * dx0;
    let ty0 = y0 + Math.sin(ang0) * dx0;
    let tx1 = x1 + Math.cos(ang1) * dx1;
    let ty1 = y1 + Math.sin(ang1) * dx1;
    if (get_str([param.ar, param.arrow]).includes("<-")) draw_arrow_head(ctx, cvs, tx0 + Math.cos(ang0), ty0 + Math.sin(ang0), tx0, ty0, param);
    if (get_str([param.ar, param.arrow]).includes("->")) draw_arrow_head(ctx, cvs, tx1 + Math.cos(ang1), ty1 + Math.sin(ang1), tx1, ty1, param);
    if (x0 == x1 && y0 == y1) return draw_scaled_curve(ctx, cvs, tx0, ty0, a0, dx0 * 2, a1, dx1 * 2, tx1, ty1, param);
    else return draw_curve(ctx, cvs, tx0, ty0, a0, a1, tx1, ty1, param);
}

/**
 * Draw an arrow with tangent from (x0, y0) to (x1, y1)
 * @param {any} ctx The context of the canvas
 * @param {any} cvs The canvas element
 * @param {number} x0 The x value of the starting point
 * @param {number} y0 The y value of the starting point
 * @param {number} x1 The x value of the ending point
 * @param {number} y1 The y value of the ending point
 * @param {object} param The item
 * @returns {any}
 */
export function draw_arrow_head(ctx, cvs, x0 = 0, y0 = 0, x1 = 1, y1 = 1, param = { ar0: get_size("arrow"), c0: "", t0: 1 }) {
    let d0p = get_num(param.ar0);
    if (d0p <= 0) d0p = get_size("arrow");
    let dx = x0 - x1;
    let dy = y1 - y0;
    let len = dist_two(x0, y0, x1, y1);
    let ux = dx / len * d0p;
    let uy = dy / len * d0p;
    param.c0 = get_str(param.c0, "blank");
    param.c1 = param.c0;
    draw_triangle(ctx, cvs, x1, y1, x1 + ux * 4 + uy, y1 - uy * 4 + ux, x1 + ux * 4 - uy, y1 - uy * 4 - ux, param);
}

// Geometry, Linear Algebra
export function unit_vec(p = { x: 1, y: 1 }) {
    let len = l_norm([p.x, p.y]);
    return { x: p.x / len, y: p.y / len };
}

export function norm_two(p0 = { x: 1, y: 1 }, p1 = { x: 0, y: 0 }) {
    return dist_two(p0.x, p0.y, p1.x, p1.y);
}

export function dist_two(x0 = 0, y0 = 0, x1 = 1, y1 = 1) {
    let dx = x0 - x1;
    let dy = y0 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Find the distance from (x, y) to the line (x0, y0) - (x1, y1)
 * @param {number} x The point x
 * @param {number} y The point y
 * @param {number} x0 The line x0
 * @param {number} y0 The line y0
 * @param {number} x1 The line x1
 * @param {number} y1 The line y1
 * @returns {any}
 */
export function distance_from_point_to_line(x = 0, y = 0, x0 = 0, y0 = 0, x1 = 1, y1 = 1) {
    let dy = y1 - y0;
    let dx = x1 - x0;
    if (dx == 0 && dy == 0) return dist_two(x, y, x0, y0);
    else return Math.abs(dy * x - dx * y + x1 * y0 - y1 * x0) / Math.sqrt(dy * dy + dx * dx);
}

export function get_angle(x0 = 0, y0 = 0, x1 = 1, y1 = 1) {
    return rad_to_deg(Math.atan2(y1 - y0, x1 - x0));
}

export function rad_to_deg(a0 = 0) {
    return a0 / Math.PI * 180.0;
}

export function deg_to_rad(a0 = 0) {
    return a0 / 180.0 * Math.PI;
}

//#region Mouse
/**
 * Get (x, y) Cartesian system coordinate (not inverted y coordinate)
 * @param {any} cvs The canvas
 * @param {any} evt The event
 * @returns {any}
 */
export function get_mouse(cvs, evt) {
    let box = cvs.getBoundingClientRect();
    return { x: evt.clientX - box.left, y: cvs.height - (evt.clientY - box.top) };
}

// Synchronize touch and mouse
export function sync_touch(cv) {
    cv.addEventListener("touchstart", function (e) {
        let touch = e.touches[0];
        let mouseEvent = new MouseEvent("mousedown", { clientX: touch.clientX, clientY: touch.clientY });
        cv.dispatchEvent(mouseEvent);
    }, { passive: true });
    cv.addEventListener("touchend", function (e) {
        let touch = e.changedTouches[0];
        let mouseEvent = new MouseEvent("mouseup", { clientX: touch.clientX, clientY: touch.clientY });
        cv.dispatchEvent(mouseEvent);
    }, { passive: true });
    cv.addEventListener("touchmove", function (e) {
        let touch = e.touches[0];
        let mouseEvent = new MouseEvent("mousemove", { clientX: touch.clientX, clientY: touch.clientY });
        cv.dispatchEvent(mouseEvent);
    }, { passive: true });
    document.body.addEventListener("touchstart", function (e) {
        if (e.target == cv) e.preventDefault();
    }, { passive: false });
    document.body.addEventListener("touchend", function (e) {
        if (e.target == cv) e.preventDefault();
    }, { passive: false });
    document.body.addEventListener("touchmove", function (e) {
        if (e.target == cv) e.preventDefault();
    }, { passive: false });
}
//#endregion

//#region String Manipulation
export function get_div_list() {
    return ["\t", ";", ",", " "];
}

/**
 * Convert to string expression w0 x0 + w1 x1 + ...
 * @param {any[]} w The coefficients
 * @param {string[]} x The variable names
 * @returns {any}
 */
export function lin_eq_to_str(w = [0], x = ["x"]) {
    let str = "";
    for (let i = 0; i < w.length; i++) {
        if (str != "" && w[i] > 0) str += " + ";
        let xi = get_i(x, i, "").trim();
        if (w[i] == 1 && xi != "") str += xi;
        else if (w[i] == -1 && xi != "") str += " - " + xi;
        else if (w[i] != 0) str += w[i] + " " + xi;
    }
    return (str == "" ? "0" : str);
}

/**
 * Convert a vector to [x, y, z, w]
 * @param {any[]} vec The vector
 * @param {number} n The significance, decimal places
 * @returns {string}
 */
export function vec_to_str(vec = [0], n = -1, is = ", ", il = "[", ir = "]") {
    let str_vec = vec.map(i => (typeof i == "number" && n >= 0) ? i.toFixed(n) : String(i));
    return il + str_vec.join(is) + ir;
}

/**
 * Convert a vector to x, y, z, w
 * @param {any[]} vec The vector
 * @param {number} n The significance, decimal places
 * @returns {string}
 */
export function vec_to_str_line(vec = [0], n = -1, comma = ", ") {
    return vec_to_str(vec, n, comma, "", "");
}

/**
 * Convert a matrix to [[x, y], [z, w]]
 * @param {any[][]} mat The matrix
 * @param {number} n The significance, decimal places 
 * @returns {string}
 */
export function mat_to_str(mat = [[0]], n = -1, os = ", ", is = ", ", ol = "[", or = "]", il = "[", ir = "]") {
    let str_vec = mat.map(i => vec_to_str(i, n, is, il, ir));
    return ol + str_vec.join(os) + or;
}

/**
 * Convert a matrix to x, y /n z, w
 * @param {any[][]} mat The matrix
 * @param {number} n The significance, decimal places 
 * @returns {string}
 */
export function mat_to_str_line(mat = [[0]], n = -1, comma = ", ") {
    return mat_to_str(mat, n, "\n", comma, "", "", "", "");
}

// Round all numbers in a vector to n decimal places
export function round_vec(vec = [0], n = 4) {
    return vec.map(i => round(i, n));
}

// Round all numbers in a vector to n decimal places
export function round_mat(mat = [[0]], n = 4) {
    return mat.map(i => round_vec(i, n));
}

/**
 * Round a number x to n decimal places
 * @param {number|string} x The number
 * @param {number} n Significant digits
 * @returns 
 */
export function round(x = 0, n = 4) {
    let y = (typeof x == "string" ? Number(x) : x);
    if (n <= 0) return Math.round(y);
    return Number(y.toFixed(n));
}

export function sym_vec_to_str(x = "x", n = 2) {
    if (n <= 0) return "[]";
    let s = "[" + x + "[1]";
    for (let i = 1; i < n; i++) s += ", " + x + "[" + (i + 1) + "]";
    return s + "]";
}

export function read_double_vec(s = "0", d = "") {
    let str = get_str(s);
    let div = get_str(d);
    if (div == "") div = get_div(str);
    return str.split(div).map(Number);
}

export function read_double_mat(s = "0", d1 = "", d2 = "") {
    let str = get_str(s);
    let div1 = get_div(d1);
    let div2 = get_div(d2);
    let div_list = get_div_list();
    if (div1 == "") div1 = get_div(str, div_list);
    if (div2 == "") div2 = get_div(str, div_list.filter(l => l != div1));
    return str.split(div1).map(l => l.split(div2).map(Number));
}

// Convert point (x, y) to [x, y]
export function point_to_str(p = { x: 0, y: 0 }) {
    return "[" + p.x + ", " + p.y + "]";
}

// Convert all points to [x, y] in a list
export function points_to_str(ps = [{ x: 0, y: 0 }]) {
    return ps.map(point_to_str).reduce((x, y) => x + ", " + y);
}

// Find the first occurrence of a symbol in list
export function get_div(s = "", list = get_div_list()) {
    for (const l of list) {
        if (s.includes(l)) return l;
    }
    return list.pop();
}

/**
 * Get the value or innerHTML if it starts with @ if it exists
 * @param {string} s The string or field name
 * @param {string} def The default string
 * @param {boolean} field Whether to force convert to field name
 * @returns {string|number}
 */
export function get(s = undefined, def = undefined, field = false) {
    if (typeof def == "string") return get_str(s, def, field);
    else if (typeof def == "number") return get_num(s, def, true, field);
    else return s;
}

/**
 * Get the value or innerHTML if it starts with @ if it exists
 * @param {string|number|string[]|number[]} s The string or field name
 * @param {string} def The default string
 * @param {boolean} field Whether to force convert to field name
 * @returns {string}
 */
export function get_str(s = "", def = "", field = false) {
    if (Array.isArray(s)) {
        let ret;
        for (let si of s) {
            ret = get_str(si, null, field);
            if (ret != null) return ret;
        }
        return def;
    }
    if (s == undefined || s == null || s == "") return def;
    let str = field ? field_name(String(s), true) : String(s);
    if (str.startsWith("@")) {
        let elem = get_elem(str);
        if (elem == null) return def;
        let type = get_elem_type(elem);
        if (type == "input_checkbox") return String(elem.checked);
        else if (starts_with(type, "input")) return elem.value;
        else return elem.value || elem.innerHTML || def;
    }
    else return str || def;
}

/**
 * Get the number of a field
 * @param {any} s The string or field name
 * @param {number} def The default number
 * @param {boolean} eva Whether to possibly evaluate the expression
 * @param {boolean} field Whether to force conversion to field name
 * @returns {number}
 */
export function get_num(s = "", def = 0, eva = true, field = false) {
    if (Array.isArray(s)) {
        let ret;
        for (let si of s) {
            ret = get_num(si, null, field);
            if (ret != null) return ret;
        }
        return def;
    }
    if (s == undefined || s == null || s === "") return def;
    else if (typeof s == "number") return s;
    else {
        let str = Number(get_str(s, "", field));
        if (eva && isNaN(str)) return get_eval(String(s), def);
        else return str;
    }
}

/**
 * Evaluate a math expression
 * @param {string} s The string or field name
 * @param {number} def The default number
 * @returns {number}
 */
export function get_eval(s = "", def = 0) {
    try {
        let value = Number(math.evaluate(s));
        if (isNaN(value) || !isFinite(value)) return def;
        else return value;
    }
    catch (err) {
        print_error("Cannot evaluate: " + s);
        return def;
    }
}

export function math_page(m = "", dis = m + "_display", cod = m + "_code", result = m + "_result") {
    let s = get_str(m);
    set_str("$$" + s, dis);
    MathJax.typeset();
    set_str("<code>" + to_tex(s, 2) + "</code>", cod);
    set_str(String(math_eval(s)), result);
}

export function math_eval_page(m = "", cal = m, vec = "") {
    let s = get_str(m, "");
    let val = "";
    let vs = s.split("\n");
    for (let i in vs) {
        if (vec) vs[i] = "[" + trim(vs[i], ["[", "]"]) + "]";
        if (vs[i].trim() != "") {
            let cv = math_eval(vs[i], Number.POSITIVE_INFINITY);
            if (Number(i) > 0) val += ";;";
            if (cv == Number.POSITIVE_INFINITY && vs[i].includes(",")) {
                cv = math_eval("[" + vs[i] + "]", 0);
                if (cv == 0) val += "0";
                else if (is_vec(cv)) val += cv.join(",");
            }
            else val += cv;
        }
    }
    set_str(val, cal);
}

export function math_simp_page(m = "", cal = m) {
    let s = get_str(m, "");
    let val = "";
    if (s != "") val = math_simp(s, s);
    set_str(val, cal);
}

/**
 * Evaluate a string expression
 * @param {string} s The string to evaluate
 * @param {number} def The default return value
 * @returns {number|number[]|number[][]}
 */
export function math_eval(s = "", def = 0) {
    try {
        let t = math.evaluate(s);
        if (String(t).trim().startsWith("[[")) return str_to_mat(String(t), false);
        else if (String(t).trim().startsWith("[")) return str_to_vec(String(t), false);
        else if (isNaN(Number(t))) return def;
        else return Number(t);
    }
    catch (err) {
        return def;
    }
}

/**
 * Evaluate a string expression at some point
 * @param {string} s The string to evaluate
 * @param {string[]|string} x The string variable names
 * @param {number[]|number} v The values of x
 * @param {number} def The default return value
 * @returns {any}
 */
export function math_eval_at(s = "", x = ["x"], v = [0], def = 0) {
    try {
        let param = {};
        if (is_vec(x)) x.forEach((xi, i) => param[xi] = v[i]);
        else param[x] = v;
        let t = math.evaluate(s, param);
        if (String(t).trim().startsWith("[[")) return str_to_mat(String(t), false);
        else if (String(t).trim().startsWith("[")) return str_to_vec(String(t), false);
        else if (isNaN(Number(t))) return def;
        else return Number(t);
    }
    catch (err) {
        return def;
    }
}

/**
 * Simplify a string expression
 * @param {string} s The string to evaluate
 * @param {string} def The default return value
 * @returns {string}
 */
export function math_simp(s = "", def = s) {
    try {
        let t = math.simplify(s);
        return math.format(t);
    }
    catch (err) {
        return def;
    }
}

/**
 * Set string s to field with id d, $ means to latex $ ... $, $$ means to latex $$ ... $$
 * @param {number|string|string[]|number[]} s The string
 * @param {string|string[]} d The field to set it in
 * @returns {any}
 */
export function set_str(s = "", d = "") {
    if (is_vec(d)) d.forEach((di, i) => set_str(get_i(s, i, ""), di));
    else {
        let str = get_str(s);
        let element = get_elem(d);
        if (element) {
            let type = get_elem_type(element);
            if (starts_with(type, "img")) {
                if (element.src !== undefined) element.src = str;
            }
            else if (str.startsWith("$") && !str.includes("\n")) {
                str = pre_tex(str);
                if (str.startsWith("$$")) str = to_tex(str.substring(2).trim(), 2);
                else str = to_tex(str.substring(1).trim(), 1);
                str = post_tex(str);
                if (element.innerHTML !== undefined) {
                    element.innerHTML = str;
                    //MathJax.Hub.processSectionDelay = 0;
                    //MathJax.Hub.Queue(["Typeset", MathJax.Hub, element]);
                }
                else print_error("Not text element: " + d);
            }
            else {
                if (starts_with(type, "span")) element.innerHTML = str;
                else if (starts_with(type, ["input", "text"])) element.value = str;
                else print_error("Not text element: " + d);
            }
        }
    }
}

/**
 * Preprocess tex conversion for special symbols
 * @param {string} s Text
 * @returns {any}
 */
export function pre_tex(s = "") {
    s = s.replace("^*", "^888");
    return s;
}

/**
 * Post-process tex conversion for special symbols
 * @param {string} s Tex
 * @returns {any}
 */
export function post_tex(s = "") {
    s = s.replace("^{888}", "^{\\star}");
    return s;
}

// Print error to multiple places
export function print_error(s = "", id = "error") {
    console.log(s);
    let element = get_elem(field_name(id));
    if (element != null && element.innerHTML != undefined) element.innerHTML = s;
}

// Get the break line string
export function get_br() {
    return " <br>\n";
}

export function get_tab() {
    return "    ";
}

// Convert to tex
export function to_tex(s = "", dollar = 1) {
    try {
        let tex = math.parse(s).toTex({ parenthesis: "auto" });
        if (tex == "undefined") return s;
        if (dollar == 2) return "\\[" + tex + "\\]";
        else if (dollar == 1) return "\\(" + tex + "\\)";
        else return tex;
    }
    catch (err) {
        print_error("Cannot convert to latex: " + s);
        return s;
    }
}

// Convert a vector to tex
export function to_tex_vec(s = [""], dollar = 1) {
    return s.map(i => to_tex(i, dollar));
}
//#endregion

// Statistics
/**
 * Generate seed
 * @param {string} x seed
 * @returns {any}
 */
export function rand_seed(x = "") {
    if (x == "") Math.seedrandom();
    else Math.seedrandom(x);
}

/**
 * Generate a matrix of independent random variables
 * @param {function} rand_single The method to generate a single variable
 * @param {any[]} params The parameters
 * @param {number} n Number of rows or -1
 * @param {number} m Number of columns or -1
 * @returns {any}
 */
export function rand_mat(rand_single = rand, params = [], n = -1, m = -1) {
    if (n <= 0 && m <= 0) return rand_single(...params);
    else if (m <= 0) return Array.from({ length: n }, () => rand_single(...params));
    else return Array.from({ length: n }, () => rand_mat(rand_single, params, m));
}

/**
 * Generate uniform random integer from a to b, include b
 * @param {number} a Min
 * @param {number} b Max
 * @param {number|number[]} not What to avoid
 * @returns {any}
 */
export function rand_int_not(a = 0, b = 1, not = [], n = -1, m = -1) {
    if (n <= 0 && m <= 0) {
        if (a == b) return a;
        else {
            let c = rand_int(a, b);
            if (is_vec(not)) {
                while (!not.includes(c)) c = rand_int(a, b);
            } else {
                while (c == not) c = rand_int(a, b);
            }
            return c;
        }
    }
    else return rand_mat(rand_int_not, [a, b, not], n, m);
}

/**
 * Generate n x m matrix with uniform random integer from a to b, include b
 * @param {number} a Min
 * @param {number} b Max
 * @param {number} n Number of rows
 * @param {number} m Number of columns
 * @returns {any}
 */
export function rand_int(a = 0, b = 1, n = -1, m = -1) {
    if (n <= 0 && m <= 0) return Math.floor(rand(a, b + 1));
    else return rand_mat(rand_int, [a, b], n, m);
}

/**
 * Generate n x m matrix with uniform random number from a to b, not include b
 * @param {number} a Min
 * @param {number} b Max
 * @param {number} n Number of rows
 * @param {number} m Number of columns
 * @returns {any}
 */
export function rand(a = 0, b = 1, n = -1, m = -1) {
    if (n <= 0 && m <= 0) return Math.random() * Math.abs(a - b) + Math.min(a, b);
    else return rand_mat(rand, [a, b], n, m);
}

/**
 * Generate uniform random from a to b, not include b
 * @param {number} a Min
 * @param {number} b Max
 * @param {number|number[]} not What to avoid
 * @returns {any}
 */
export function rand_not(a = 0, b = 1, not = [], n = -1, m = -1) {
    if (n <= 0 && m <= 0) {
        if (a == b) return a;
        else {
            let c = rand(a, b);
            if (typeof not == "number") while (c == not) c = rand(a, b);
            else while (!not.includes(c)) c = rand(a, b);
            return c;
        }
    }
    else return rand_mat(rand_not, [a, b, not], n, m);
}

/**
 * Compute gamma(alpha)
 * @param {number} alpha Alpha
 * @returns {any}
 */
export function gamma(alpha = 0) {
    return math.gamma(alpha);
}

export function rand_chi_sq(df = 1, n = -1, m = -1) {
    if (n <= 0 && m <= 0) {
        let chi = 0;
        let nr;
        for (let i = 0; i < df; i++) {
            nr = rand_norm();
            chi += nr * nr;
        }
        return chi;
    }
    else return rand_mat(rand_chi_sq, [df], n, m);
}

export function pdf_chi_sq(x = 0, df = 1) {
    return 1 / (Math.pow(2, 0.5 * df) * gamma(0.5 * df)) * Math.pow(x, 0.5 * df - 1) * Math.exp(- 0.5 * x);
}

export function rand_t(df = 1, n = -1, m = -1) {
    if (n <= 0 && m <= 0) return rand_norm() * Math.sqrt(df / rand_chi_sq(df));
    else return rand_mat(rand_t, [df], n, m);
}

export function pdf_t(x = 0, df = 1) {
    return gamma(0.5 * (df + 1)) / (Math.sqrt(df * Math.PI) * gamma(0.5 * df)) * Math.pow(1 + x * x / df, - 0.5 * (df + 1));
}

export function rand_beta(alpha = 1, beta = 1, n = -1, m = -1) {
    if (n <= 0 && m <= 0) {
        let x = rand_gamma(alpha, 1);
        let y = rand_gamma(beta, 1);
        return x / (x + y);
    }
    else return rand_mat(rand_beta, [alpha, beta], n, m);
}

export function pdf_beta(x = 0, alpha = 1, beta = 1) {
    return Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1) * gamma(alpha + beta) / gamma(alpha) / gamma(beta);
}

export function rand_exp(lambda = 1, n = -1, m = -1) {
    if (n <= 0 && m <= 0) return -Math.log(rand()) / lambda;
    else return rand_mat(rand_exp, [lambda], n, m);
}

export function pdf_exp(x = 0, lambda = 1) {
    return lambda * Math.exp(- lambda * x);
}

export function rand_gamma(alpha = 1, beta = 1, n = -1, m = -1) {
    if (n <= 0 && m <= 0) {
        let k = Math.floor(alpha);
        let delta = alpha - k;
        let u = rand();
        let v = rand();
        let w = rand();
        let iter = 0;
        let xi, eta, xd, ex;
        let int_part = 0;
        for (let i = 0; i < k; i++) int_part += Math.log(rand());
        while (iter < 100) {
            xd = Math.pow(xi, delta - 1);
            ex = Math.exp(-xi);
            if (u < Math.E / (Math.E + delta)) {
                xi = Math.pow(v, 1 / delta);
                eta = w * xd;
            }
            else {
                xi = 1 - Math.log(v);
                eta = w * ex;
            }
            if (eta <= xd * ex) return (xi - int_part) / beta;
            iter++;
        }
        return alpha / beta;
    }
    else return rand_mat(rand_gamma, [alpha, beta], n, m);
}

export function pdf_gamma(x = 0, alpha = 1, beta = 1) {
    return Math.pow(beta, alpha) / gamma(alpha) * Math.pow(x, alpha - 1) * Math.exp(- beta * x);
}

/**
 * Generate n x m matrix with normal random number
 * @param {number} mu Mean
 * @param {number} sig Standard deviation
 * @param {number} n Number of rows
 * @param {number} m Number of columns
 * @returns {any}
 */
export function rand_norm(mu = 0, sig = 1, n = -1, m = -1) {
    if (n <= 0 && m <= 0) return mu + sig * Math.sqrt(-2 * Math.log(rand() + Number.EPSILON)) * Math.cos(2 * Math.PI * rand());
    else return rand_mat(rand_norm, [mu, sig], n, m);
}

export function pdf_norm(x = 0, mu = 0, sig = 1) {
    let z = (x - mu) / sig;
    return 1.0 / sig / Math.sqrt(2 * Math.PI) * Math.exp(-0.5 * z * z);
}

/**
 * Generate n x 2 matrix with correlated normal random number
 * @param {number[]} mu Mean
 * @param {number[][]} sig Standard deviation
 * @param {number} n Number of rows
 * @param {number} m Number of columns
 * @returns {any}
 */
export function rand_bi_norm(mu = 0, sig = 1, n = -1, m = -1) {
    if (n <= 0 && m <= 0) {
        let u1 = rand() + Number.EPSILON;
        let u2 = rand();
        let s = Math.sqrt(-2 * Math.log(u1));
        let z1 = s * Math.cos(2 * Math.PI * u2);
        let z2 = s * Math.sin(2 * Math.PI * u2);
        let s1 = Math.sqrt(Math.abs(sig[0][0]));
        let s2 = Math.sqrt(Math.abs(sig[1][1]));
        let rho = bound((sig[0][1] || sig[1][0]) / s1 / s2, -1, 1);
        return [mu[0] + s1 * z1, mu[1] + s2 * rho * z1 + s2 * Math.sqrt(1 - rho * rho) * z2];
    }
    else if (m <= 0) return Array.from({ length: n }, () => rand_bi_norm(mu, sig));
    else return Array.from({ length: n }, () => rand_bi_norm(mu, sig, m));
}

/**
 * Generate one sign +1 or -1
 * @returns {any}
 */
export function rand_sign() {
    return rand() < 0.5 ? -1 : 1;
}

/**
 * Generate one random element (discrete distribution)
 * @param {number[]} p Distribution
 * @param {any[]} x Random variable
 * @returns {any}
 */
export function rand_dist(p = [0.5, 0.5], x = [0, 1], n = -1, m = -1, cdf_check = true) {
    let cdf = cdf_check ? get_cdf(p) : p;
    if (n <= 0 && m <= 0) {
        let u = rand(0, 1);
        let i = 0;
        while (u > cdf[i]) i++;
        if (cdf.length == x.length) return x[i];
        else return i;
    }
    else if (m <= 0) return Array.from({ length: n }, () => rand_dist(cdf, x, -1, -1, false));
    else Array.from({ length: n }, () => rand_dist(cdf, x, m, -1, false));
}

/**
 * Generate one random element 
 * @param {number[]} p Distribution
 * @returns {any}
 */
export function get_cdf(p) {
    let acc = 0;
    let cdf = p.map(pi => (acc += pi));
    cdf = cdf.map(c => Math.max(Math.min(c, 1), 0));
    if (cdf[cdf.length] < 1) cdf.push(1);
    return cdf;
}

/**
 * Generate n x 1 vector with unique uniform random integer from a to b, include b
 * @param {number} a Min
 * @param {number} b Max
 * @param {number} n Number of rows
 * @returns {number[]}
 */
export function rand_unique_int_vec(a = 0, b = 1, n = 2) {
    if (n >= b - a + 1) return seq(a, b, 1);
    let vec = [];
    for (let i = 0; i < n; i++) {
        let t = rand_int(a, b);
        if (!vec.includes(t)) vec.push(t);
        else i--;
    }
    return vec;
}

/**
 * Generate n x 1 vector with unique uniform random number from a to b, including a
 * @param {number} a Min
 * @param {number} b Max
 * @param {number} n Number of rows
 * @returns {any}
 */
export function rand_unique_vec(a = 0, b = 1, n = 2) {
    if (a == b) return rep(a, n);
    let vec = [];
    for (let i = 0; i < n; i++) {
        let t = rand(a, b);
        if (!vec.includes(t)) vec.push(t);
        else i--;
    }
    return vec;
}

export function rand_unique_int_columns(a = 0, b = 1, n = 1, m = 1) {
    let unique = rand_unique_int_vec(a, b, n);
    let x = [];
    if (m == 1) x = unique.map(ui => [ui]);
    else {
        x = rand_int(a, b, n, m - 1);
        x = x.map((xi, i) => [unique[i], ...xi]);
    }
    return x;
}

// Random basis vector (1, 0, 0), (0, 1, 0), (0, 0, 1)
export function rand_basis_vec(n = 2) {
    let vec = zero_vec(n);
    let pos = rand_int(0, n - 1);
    vec[pos] = 1;
    return vec;
}

/**
 * Get a random element of list
 * @param {any[]} list The original list
 * @returns {any}
 */
export function rand_elem(list = [1], n = -1, m = -1) {
    if (n <= 0 && m <= 0) return list[rand_int(0, list.length - 1)];
    else if (m <= 0) return Array.from({ length: n }, () => rand_elem(list));
    else return Array.from({ length: n }, () => rand_elem(list, m));
}

/**
 * Get a random subset of list
 * @param {any[]} list The original list
 * @param {number} s The size of subset
 * @returns {any}
 */
export function rand_subset(list = [1], s = 1) {
    return extract_vec(list, rand_subset_index(list.length, s));
}

/**
 * Get a random subset index
 * @param {number} n The size of original list (from 0 to n - 1)
 * @param {number} s The size of subset
 * @returns {any}
 */
export function rand_subset_index(n = 1, s = 1) {
    let t = seq(0, n - 1, 1);
    shuffle(t);
    if (s < n) t.splice(s, n - s);
    return t;
}

export function rand_partition(n = 2, k = 1, min = 0) {
    if (n - min * k <= 0) return rep(min, k);
    let list = seq(1, n + k - 1, 1);
    let a = rand_subset(list, k - 1);
    a.sort((i, j) => i - j);
    a.push(n + k);
    return a.map((ai, i) => i == 0 ? ai - 1 : ai - a[i - 1] - 1);
}

export function normalize_sum_by_row(mat = [[]], sum = 1) {
    let s = row_sum(mat);
    return mat.map((mi, i) => mi.map(mij => mij / s[i] * sum));
}

export function rand_transition(n = 3, m = 3) {
    return normalize_sum_by_row(rand(1, 10, n, m));
}

export function cdf_inversion(cdf = [0], u = 0) {
    for (let i = 0; i < cdf.length; i++) {
        if (u < cdf[i]) return i;
    }
    return cdf.length - 1;
}

export function fix_round(t = [0], total = 1, sig = 2) {
    let s = vec_sum(t);
    if (s > total) {
        let i = arg_max(t);
        t[i] -= (s - total);
        t[i] = round(t[i], sig);
    }
    else if (s < total) {
        let i = arg_min(t);
        t[i] += (total - s);
        t[i] = round(t[i], sig);
    }
    return t;
}

export function fix_round_by_row(t = [[0]], total = 1, sig = 2) {
    return t.map(ti => fix_round(ti, total, sig));
}

/**
 * Extract the array according to the list of indices
 * @param {any[]} x The original array
 * @param {number[]} index The index
 * @returns {any}
 */
export function extract_vec(x = [0], index = [0]) {
    let y = [];
    let n = x.length;
    if (n == 0) return y;
    for (let j of index) y.push(x[mod(j, n)]);
    return y;
}

export function splice_row(x = [[0]], i = 0) {
    return x.splice(i, 1);
}

export function splice_col(x = [[0]], i = 0) {
    let col = [];
    x.forEach(xi => col.push(xi.splice(i, 1)));
    return col;
}

/**
 * Modulo with negative numbers handled correctly
 * @param {number} x The number 
 * @param {number} b The mod
 * @returns {any}
 */
export function mod(x = 1, b = 1) {
    let m = Math.abs(b);
    if (m == 0) return 0;
    else return ((Math.floor(x) % m) + m) % m;
}

// Linear Algebra
/**
 * Zero vector n x 1
 * @param {number} n Number of rows
 * @param {any} zero Element to fill
 * @param {function} f Function to apply to each element
 * @returns {any}
 */
export function zero_vec(n = 2, zero = 0, f = undefined) {
    let a = Array(n).fill(zero);
    if (f) return a.map((_, i) => f(i));
    else return a;
}

/**
 * Zero matrix n x m
 * @param {number} n Number of rows
 * @param {number} m Number of columns
 * @param {any} zero Element to fill
 * @param {function} f Function to apply to each element
 * @returns {any}
 */
export function zero_mat(n = 2, m = n, zero = 0, f = undefined) {
    let a = Array(n).fill().map(() => Array(m).fill(zero));
    if (f) return a.map((ai, i) => ai.map((_, j) => f(i, j)));
    else return a;
}

/**
 * Check if a export function is always non-negative
 * @param {function} f The export function
 * @param {number[]} x The list of points to check
 */
export function always_positive(f = y => y, x = [-2, -1, -0.5, 0, 0.5, 1, 2]) {
    return x.reduce((s, xi) => s && f(xi) >= 0, true);
}

/**
 * Check if a export function is always position
 * @param {function} f The export function
 * @param {number[]} x The list of points to check
 */
export function always_constant(f = y => y, x = [-2, -1, -0.5, 0, 0.5, 1, 2]) {
    let f0 = f(x[0]);
    return x.reduce((s, xi) => s && (f(xi) == f0), true);
}

/**
 * Check if two functions are equal
 * @param {function} f Function 1 
 * @param {function} g Function 2
 * @param {number[]} range Set of points to check
 * @returns 
 */
export function func_equal(f = x => x, g = x => x, range = [-2, -1, 0, 0.1, 0.2, 0.4, 1, 2, 4]) {
    let correct = range.reduce((s, i) => s + (close_to(f(i), g(i), 4) ? 1 : 0), 0);
    return correct == range.length;
}

// Dom element manipulation
/**
 * Get the element, remove the dollar sign
 * @param {string} name 
 * @returns {any}
 */
export function get_elem(name = "") {
    if (name.startsWith("@")) return document.getElementById(name.substring(1).trim());
    else return document.getElementById(name.trim());
}

// Get type given string name
export function get_type(name = "") {
    return get_elem_type(get_elem(name));
}

// Get type given element, format:tagName_type
export function get_elem_type(element = null) {
    if (element) {
        let name = element.tagName.toLowerCase();
        if (element.type !== undefined) return name + "_" + element.type.toLowerCase();
        else return name;
    }
    else return "null";
}

// Check if type is equal to type
export function is_elem_type(elem = null, type = "") {
    let t = get_elem_type(elem);
    return starts_with(t, type);
}

// Check if type is one of the types
export function is_elem_types(elem = null, type = [""]) {
    let t = get_elem_type(elem);
    return starts_with(t, type, true);
}

/**
 * Check if a string ends with a
 * @param {string} s The string to be checked
 * @param {string|string[]} a The string prefix
 * @param {boolean} ignore Whether to ignore case
 * @param {boolean} fast Whether to assume not array
 * @returns {string}
 */
export function starts_with(s = "", a = "", ignore = false, fast = false) {
    if (!fast && is_vec(a)) return a.reduce((is, i) => is || starts_with(s, i, ignore), "");
    else if (!is_vec(a)) {
        if (!fast && typeof s != "string") return starts_with(String(s), a, ignore);
        else if (!fast && typeof a != "string") return starts_with(s, String(a), ignore);
        else if (ignore) return s.toLowerCase().startsWith(a.toLowerCase()) ? a : "";
        else return s.startsWith(a) ? a : "";
    }
    else return "";
}

/**
 * Check if a string ends with a
 * @param {string} s The string to be checked
 * @param {string|string[]} a The string suffix
 * @param {boolean} ignore Whether to ignore case
 * @param {boolean} fast Whether to assume not array
 * @returns {string}
 */
export function ends_with(s = "", a = " ", ignore = false, fast = false) {
    if (!fast && is_vec(a)) return a.reduce((is, i) => is || ends_with(s, i, ignore), "");
    else if (!is_vec(a)) {
        if (!fast && typeof s != "string") return ends_with(String(s), a, ignore);
        else if (!fast && typeof a != "string") return ends_with(s, String(a), ignore);
        else if (ignore) return s.toLowerCase().endsWith(a.toLowerCase()) ? a : "";
        else return s.endsWith(a) ? a : "";
    }
    else return "";
}

// Common CS540 Functions
export function count_equal(a = [], b = [], d = -1) {
    if (d < 0) return a.reduce((s, x, i) => s + (x == b[i] ? 1 : 0), 0);
    else return a.reduce((s, x, i) => s + (close_to(x, b[i], d) ? 1 : 0), 0);
}

/**
 * Count the number of things that are the same
 * @param {any} a First matrix
 * @param {any} b Second matrix
 * @param {number} d Decimal places
 * @returns {any}
 */
export function count_same(a = [[0]], b = [[0]], d = -1) {
    if (!a.length) {
        if (d < 0) return a == b ? 1 : 0;
        else return close_to(a, b, d) ? 1 : 0;
    }
    else return a.reduce((s, ai, i) => s + count_same(ai, b[i]), 0);
}

/**
 * Check whether a and b are close
 * @param {number} a The comparing
 * @param {number} b The compared
 * @param {number} d The number of significant digits, def = 2
 * @returns {any}
 */
export function close_to(a = 0, b = 1, d = 4) {
    return (Math.abs(a - b) < Math.pow(10, -d));
}

/**
 * Check whether a and b are close
 * @param {number} a The comparing
 * @param {number} b The compared
 * @returns {any}
 */
 export function close_to_ans(a = 0, b = 1, d = -1) {
    let sig = d >= 0 ? d : Math.max(Math.min(get_decimal(String(b)), 4), 2);
    return close_to(a, b, sig);
}

/**
 * Get the number of decimal places for a string or a number
 * @param {string} x The string version of the number
 * @returns {number}
 */
export function get_decimal(x = "") {
    if (typeof x == "string") {
        let n = x.indexOf(".");
        if (n < 0) return 0;
        else return x.length - n - 1;
    }
    else if (typeof x == "number") return get_decimal(String(x));
    else return -1;
}

/**
 * Get the node list from the object list
 * @param {any[]} objects List of objects
 * @returns {any}
 */
export function get_node_list_from_objects(objects = [{ type: "none" }]) {
    let list = [];
    let found = false;
    for (let o of objects) {
        if (o.type == "node") {
            if (!found && o.initial != undefined) {
                list.unshift(o.id);
                found = true;
            }
            else list.push(o.id);
        }
    }
    return list;
}

/**
 * Get the initial node from the object list
 * @param {any[]} objects List of objects
 * @returns {any}
 */
export function get_start_from_objects(objects = [{ type: "none" }]) {
    for (let o of objects) {
        if (o.type == "node" && o.initial != undefined) return o.id;
    }
}

/**
 * Get the accepting node from the object list
 * @param {any[]} objects List of objects
 * @returns {any}
 */
export function get_end_from_objects(objects = [{ type: "none" }]) {
    let end = [];
    for (let o of objects) {
        if (o.type == "node" && o.accept != undefined) end.push(o.id);
    }
    return end;
}

/**
 * Get the data set from the object list
 * @param {any[]} objects List of objects
 * @returns {any}
 */
export function get_mat_from_objects(objects = [{ type: "none" }]) {
    let list = objects.filter(o => starts_with(o.type, ["point", "pt"]));
    return list.map(p => [p.x, p.y]);
}

/**
 * Get the labels from the object list
 * @param {any[]} objects List of objects
 * @returns {any}
 */
export function get_label_from_objects(objects = [{ type: "none" }]) {
    let list = objects.filter(o => starts_with(o.type, ["point", "pt"]));
    return list.map(p => p.class || 0);
}

/**
 * Get the adjacency matrix from the object list
 * @param {object[]} objects List of objects
 * @param {boolean} selected Only output selected nodes
 * @returns {number[][]}
 */
export function get_graph_from_objects(objects = [{ type: "none" }], selected = false) {
    let list = get_node_list_from_objects(objects);
    let n = list.length;
    let g = zero_mat(n, n);
    for (let o of objects) {
        if (o.type == "edge") {
            let ids = o.id.split("-");
            if (!selected || o.selected) g[list.indexOf(ids[0])][list.indexOf(ids[1])] = 1;
        }
        else if (selected && o.type == "node") {
            if (o.selected) g[list.indexOf(o.id)][list.indexOf(o.id)] = 1;
        }
    }
    return g;
}

/**
 * Get the list of selected object names from the object list
 * @param {any[]} objects List of objects
 * @returns {any}
 */
export function get_selected_from_objects(objects = [{ type: "none" }]) {
    let selected = objects.filter(o => o.selected);
    return selected.map(v => v.name || v.id || "");
}

/**
 * Search explored sequence
 * @param {number[][]} graph The adjacency matrix: from ROW to COL
 * @param {number} start Initial state
 * @param {number[]} end Goal states
 * @param {string[]} name The name of the states
 * @returns {any}
 */
export function search_explored(graph = [[0]], type = "bfs", start = 0, end = [graph.length - 1], name = seq(0, graph.length - 1, 1)) {
    let q = [start];
    let level = [0];
    let pop = -1;
    let sq = [];
    let c = [];
    let l = 0;
    let depth = max_depth(graph, start);
    while (q.length > 0 && !end.includes(pop) && l <= depth + 1) {
        if (type == "bfs") pop = bfs_search_step(graph, q, sq, c);
        else if (type == "dfs") pop = dfs_search_step(graph, q, sq, c);
        else if (type == "ids") {
            pop = ids_search_step(graph, start, end, q, sq, c, level, l);
            l++;
        }
    }
    return extract_vec(name, sq);
}

/**
 * Search explored sequence
 * @param {number[][]} graph The adjacency matrix: from ROW to COL
 * @param {number} start Initial state
 * @param {number[]} end Goal states
 * @param {string[]} name The name of the states
 * @returns {any}
 */
export function search_explored_heuristic(graph = [[0]], type = "ucs", start = 0, end = [graph.length - 1], repeat = true, name = seq(0, graph.length - 1, 1)) {
    let q = [{ v: start, g: 0, h: graph[start][start], gh: graph[start][start], back: -1 }];
    let pop = -1;
    let sq = [];
    let c = [];
    let l = 0;
    let depth = max_depth(graph, start);
    while (q.length > 0 && !end.includes(pop) && l <= depth + 1) {
        if (type == "ucs") pop = ucs_search_step(graph, q, sq, c, repeat);
        else if (type == "greedy") pop = greedy_search_step(graph, q, sq, c, repeat);
        else pop = a_star_search_step(graph, q, sq, c, repeat);
        l++;
        depth++; // TODO fix this
    }
    return extract_vec(name, sq);
}

/**
 * Iterative Deepening Search step
 * @param {number[][]} Graph The adjacency matrix: from ROW to COL
 * @param {number[]} q The current queue
 * @param {number[]} sq The current list
 * @param {number[]} c The searched list
 * @returns {any}
 */
export function ids_search_step(graph = [[0]], start = 0, end = [graph.length - 1], q = [], sq = [], c = [], level = [], depth = -1) {
    let pop = -1;
    while (q.length > 0 && !end.includes(pop)) pop = dfs_search_step(graph, q, sq, c, level, depth);
    q.length = 0;
    level.length = 0;
    c.length = 0;
    q.push(start);
    level.push(0);
    return pop;
}

/**
 * Breadth First Search step
 * @param {number[][]} Graph The adjacency matrix: from ROW to COL
 * @param {number[]} q The current queue
 * @param {number[]} sq The current list
 * @param {number[]} c The searched list
 * @returns {any}
 */
export function bfs_search_step(graph = [[0]], q = [], sq = [], c = [], level = [], limit = -1) {
    let pop = q.shift();
    let l = level.shift();
    for (let t in graph[pop]) {
        if (t != pop && graph[pop][t] && !c.includes(t) && (limit == -1 || l < limit)) {
            q.push(Number(t));
            c.push(Number(t));
            level.push(l + 1);
        }
    }
    sq.push(pop);
    return pop;
}

/**
 * Depth First Search step
 * @param {number[][]} Graph The adjacency matrix: from ROW to COL
 * @param {number[]} q The current queue
 * @param {number[]} sq The current list
 * @param {number[]} c The searched list
 * @returns {any}
 */
export function dfs_search_step(graph = [[0]], q = [], sq = [], c = [], level = [], limit = -1) {
    let pop = q.shift();
    let l = level.shift();
    if (graph[pop] && graph[pop].length) {
        for (let t = graph[pop].length - 1; t >= 0; t--) {
            if (t != pop && graph[pop][t] && !c.includes(t) && (limit == -1 || l < limit)) {
                q.unshift(Number(t));
                c.push(Number(t));
                level.unshift(l + 1);
            }
        }
    }
    sq.push(pop);
    return pop;
}

/**
 * Uniform Cost Search step
 * @param {number[][]} Graph The adjacency matrix: from ROW to COL
 * @param {number[]} q The current queue
 * @param {number[]} sq The current list
 * @param {number[]} c The searched list
 * @returns {any}
 */
export function ucs_search_step(graph = [[0]], q = [], sq = [], c = [], repeat = true) {
    let item = q.shift();
    let pop = item.v;
    if (graph[pop] && graph[pop].length) {
        for (let t in graph[pop]) {
            if (t != pop && graph[pop][t]) {
                let pushed = false;
                let value = item.g + graph[pop][t];
                for (let i = 0; i < q.length; i++) {
                    if (!pushed && q[i].g > value) {
                        q.splice(i, 0, { v: t, g: value });
                        if (c.length && c.length > t) c[t] = pop;
                        pushed = true;
                    }
                    if (!repeat && q[i].v == t) {
                        if (q[i].g > value) q.splice(i, 1);
                        else pushed = true;
                    }
                }
                if (!pushed) q.push({ v: t, g: value });
            }
        }
    }
    sq.push(pop);
    return item;
}

/**
 * Greedy Search step
 * @param {number[][]} Graph The adjacency matrix: from ROW to COL
 * @param {number[]} q The current queue
 * @param {number[]} sq The current list
 * @param {number[]} c The searched list
 * @returns {any}
 */
export function greedy_search_step(graph = [[0]], q = [], sq = [], c = [], repeat = true) {
    let item = q.shift();
    let pop = item.v;
    if (graph[pop] && graph[pop].length) {
        for (let t in graph[pop]) {
            if (t != pop && graph[pop][t]) {
                let pushed = false;
                let value = graph[t][t];
                for (let i = 0; i < q.length; i++) {
                    if (!pushed && q[i].h > value) {
                        q.splice(i, 0, { v: t, h: value });
                        if (c.length && c.length > t) c[t] = pop;
                        pushed = true;
                    }
                    if (!repeat && q[i].v == t) {
                        if (q[i].h > value) q.splice(i, 1);
                        else pushed = true;
                    }
                }
                if (!pushed) q.push({ v: t, h: value });
            }
        }
    }
    sq.push(pop);
    return item;
}

/**
 * Greedy Search step
 * @param {number[][]} Graph The adjacency matrix: from ROW to COL
 * @param {number[]} q The current queue
 * @param {number[]} sq The current list
 * @param {number[]} c The searched list
 * @returns {any}
 */
export function a_star_search_step(graph = [[0]], q = [], sq = [], c = [], repeat = true) {
    let item = q.shift();
    let pop = item.v;
    if (graph[pop] && graph[pop].length) {
        for (let t in graph[pop]) {
            if (t != pop && graph[pop][t]) {
                let pushed = false;
                let value_g = item.g + graph[pop][t];
                let value_h = graph[t][t];
                let value = value_g + value_h;
                for (let i = 0; i < q.length; i++) {
                    if (!pushed && q[i].gh > value) {
                        q.splice(i, 0, { v: t, g: value_g, h: value_h, gh: value });
                        if (c.length && c.length > t) c[t] = pop;
                        pushed = true;
                    }
                    if (!repeat && q[i].v == t) {
                        if (q[i].gh > value) q.splice(i, 1);
                        else pushed = true;
                    }
                }
                if (!pushed) q.push({ v: t, g: value_g, h: value_h, gh: value });
            }
        }
    }
    sq.push(pop);
    return item;
}

export function bfs_maze(suc = [[[0, 0]]], entry = [0, 0], goal = [0, 0]) {
    let searched = zero_mat(suc.length, suc[0].length, -1);
    let t = 0;
    let pop = entry;
    let q = [entry];
    while (t <= suc.length * suc[0].length && (goal[0] < 0 || pop[0] != goal[0] || pop[1] != goal[1]) && q.length > 0) {
        pop = q.shift();
        let list = suc[pop[0]][pop[1]];
        for (let li of list) {
            if (searched[li[0]][li[1]] < 0) q.push(li);
        }
        searched[pop[0]][pop[1]] = t;
        t++;
    }
    return searched;
}

export function dfs_maze(suc = [[[0, 0]]], entry = [0, 0], goal = [0, 0]) {
    let searched = zero_mat(suc.length, suc[0].length, -1);
    let t = 0;
    let pop = entry;
    let q = [entry];
    while (t <= suc.length * suc[0].length && (goal[0] < 0 || pop[0] != goal[0] || pop[1] != goal[1]) && q.length > 0) {
        pop = q.shift();
        let list = suc[pop[0]][pop[1]];
        for (let i = list.length - 1; i >= 0; i--) {
            let li = list[i];
            if (searched[li[0]][li[1]] < 0) q.unshift(li);
        }
        searched[pop[0]][pop[1]] = t;
        t++;
    }
    return searched;
}

export function a_star_maze(suc = [[[0, 0]]], entry = [0, 0], goal = [0, 0], l = 1) {
    let searched = zero_mat(suc.length, suc[0].length, -1);
    let t = 0;
    let d = dist(entry, goal, l);
    let pop = entry;
    let q = [{ v: entry, g: 0, h: d, gh: d }];
    while (t <= suc.length * suc[0].length && (goal[0] < 0 || pop[0] != goal[0] || pop[1] != goal[1]) && q.length > 0) {
        let item = q.shift();
        pop = item.v;
        let list = suc[pop[0]][pop[1]];
        for (let i = 0; i < list.length; i++) {
            let li = list[i];
            if (searched[li[0]][li[1]] < 0) {
                let g = item.g + 1;
                let h = dist(li, goal, l);
                let gh = g + h;
                let pushed = false;
                for (let k = 0; k < q.length; k++) {
                    if (q[k].gh > gh) {
                        q.splice(k, 0, { v: li, g: g, h: h, gh: gh });
                        pushed = true;
                        break;
                    }
                }
                if (!pushed) q.push({ v: li, g: g, h: h, gh: gh });
            }
        }
        searched[pop[0]][pop[1]] = t;
        t++;
    }
    return searched;
}

/**
 * Fisher-Yates Shuffle in place
 * @param {any[]} a Array
 * @param {number} before Exclude index after this
 * @returns {any}
 */
export function shuffle(a = [0], before = a.length) {
    let n = Math.min(a.length - 1, before);
    let t = a[0];
    let i;
    while (n > 0) {
        i = rand_int(0, n - 1);
        t = a[n];
        a[n] = a[i];
        a[i] = t;
        n--;
    }
    return a;
}

export function rand_perm(n = 2) {
    return shuffle(seq(0, n - 1, 1));
}

/**
 * Generate a random tree rooted at 0
 * @param {number} n The number of nodes
 * @returns {any}
 */
export function rand_tree(n = 5) {
    let list = [-1];
    for (let i = 1; i < n; i++) list.push(rand_int(0, i - 1));
    let mat = zero_mat(n, n);
    for (let i in list) {
        if (list[i] >= 0) mat[list[i]][i] = 1;
    }
    return mat;
}

/**
 * Generate a random tree rooted at 0
 * @param {number} n The number of nodes
 * @param {number} p The probability of adding an edge
 * @returns {any}
 */
export function rand_digraph(n = 5, p = 0.5) {
    let mat = rand_tree(n);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            mat[i][j] = (mat[i][j] == 1 || mat[j][i] == 1) ? mat[i][j] : rand_dist([p, 1 - p], [1, 0]);
        }
        mat[i][i] = 0;
    }
    return mat;
}

/**
 * Generate a random graph
 * @param {number} n The number of nodes
 * @param {number} p The probability of adding an edge
 * @returns {any}
 */
export function rand_graph(n = 5, p = 0.5) {
    let g = zero_mat(n, n);
    for (let i in g) {
        for (let j in g[i]) {
            g[i][j] = rand_dist([p, 1 - p], [1, 0]);
        }
    }
    return g;
}

/**
 * Generate a random graph
 * @param {number} n The number of nodes
 * @param {number} p The probability of adding an edge
 * @returns {any}
 */
export function rand_dag(n = 5, p = 0.5) {
    let g = zero_mat(n, n);
    for (let i in g) {
        for (let j in g[i]) {
            if (i < j) g[i][j] = rand_dist([p, 1 - p], [0, 1]);
        }
    }
    let rs = row_sum(g);
    let cs = col_sum(g);
    for (let i in g) {
        if (rs[i] == 0 && cs[i] == 0) g[i][rand_int(0, n - 1)] = 1;
    }
    return g;
}

/**
 * Reorder the graph according to the new names
 * @param {number[][]} graph The graph
 * @param {any[]} old_name Original node names
 * @param {any[]} new_name New node names
 * @returns {any}
 */
export function reorder_graph(graph = [[0]], old_name = [""], new_name = [""]) {
    if (old_name.length != graph.length || new_name.length != graph.length) return graph;
    let ind = map_index(old_name, new_name, false);
    return graph.map((r, i) => r.map((_, j) => graph[ind[i]][ind[j]]));
}

/**
 * Generate a sequence from a to b step d
 * @param {number} a Start
 * @param {number} b End
 * @param {number} d Increment
 * @returns {any}
 */
export function seq(a = -1, b = 1, d = 0.1) {
    return Array.from({ length: Math.floor((b - a) / d) + 1 }, (_, i) => a + d * i);
}

/**
 * Generate a string sequence from a to b step d with prefix and postfix
 * @param {number} a Start
 * @param {number} b End
 * @param {number} d Increment
 * @param {string} pre Prefix
 * @param {string} post Postfix
 * @returns {any}
 */
export function str_seq(a = 0, b = 1, d = 1, pre = "", post = "") {
    return Array.from({ length: Math.floor((b - a) / d) + 1 }, (_, i) => pre + (a + d * i) + post);
}

/**
 * Generate a n partition from a to b
 * @param {number} a Start
 * @param {number} b End
 * @param {number} n Number of grid
 * @returns {any}
 */
export function partition(a = -1, b = 1, n = 20) {
    let d = (b - a) / n;
    return Array.from({ length: n + 1 }, (_, i) => a + d * i);
}

/**
 * Generate a sequence from x0 to x1 step dx and y0 to y1 step dy
 * @param {number} x0 Top left
 * @param {*} x1 Top right
 * @param {*} dx Incr
 * @param {*} y0 Bottom left
 * @param {*} y1 Top left
 * @param {*} dy Incr
 * @returns {any}
 */
export function double_seq(x0 = -1, x1 = 1, dx = 0.1, y0 = -1, y1 = 1, dy = 0.1) {
    let ny = Math.floor((y1 - y0) / dy) + 1;
    let nx = Math.floor((x1 - x0) / dx) + 1;
    return Array.from({ length: nx }, (_, i) => Array.from({ length: ny }, (_, j) => [x0 + dx * i, y0 + dy * j]));
}

/**
 * Generate a string sequence from a to b step d with prefix and postfix
 * @param {number} a1 Start
 * @param {number} b1 End
 * @param {number} d1 Increment
 * @param {number} a1 Start
 * @param {number} b1 End
 * @param {number} d1 Increment
 * @param {string} pre Prefix
 * @param {string} post Postfix
 * @returns {any}
 */
export function str_double_seq(a1 = 0, b1 = 1, d1 = 1, a2 = 0, b2 = 1, d2 = 1, pre = "", post = "") {
    let ny = Math.floor((b1 - a1) / d1) + 1;
    let nx = Math.floor((b2 - a2) / d2) + 1;
    return Array.from({ length: nx }, (_, i) => Array.from({ length: ny }, (_, j) => pre + (a1 + d1 * i) + "" + (a2 + d2 * j) + post));
}

/**
 * Generate a nx by ny partition from x0 to x1 and y0 to y1
 * @param {number} x0 Top left
 * @param {number} x1 Top right
 * @param {number} nx Incr
 * @param {number} y0 Bottom left
 * @param {number} y1 Top left
 * @param {number} ny Incr
 * @returns {number[][][]}
 */
export function double_partition(x0 = -1, x1 = 1, nx = 20, y0 = -1, y1 = 1, ny = 20) {
    let dy = (y1 - y0) / ny;
    let dx = (x1 - x0) / nx;
    return Array.from({ length: nx + 1 }, (_, i) => Array.from({ length: ny + 1 }, (_, j) => [x0 + dx * i, y0 + dy * j]));
}

export function replace_elements(list = [], x = " ", p = 0.5, least = 0) {
    let n = list.length;
    let run = 0;
    for (let i = 0; i < n; i++) {
        if (run >= least && rand() > p) {
            list[i] = x;
            run = 0;
        }
        else run++;
    }
}

export function count_char(script = "") {
    let code = zero_vec(27);
    for (let i = 0; i < script.length; i++) {
        let c = script.charCodeAt(i);
        if (c == 32) code[0]++;
        else if (c >= 97 && c <= 122) code[c - 96]++;
    }
    return code;
}

export function ts_diff(x = [0]) {
    let dx = x.map((xi, i) => i > 0 ? xi - x[i - 1] : 0);
    dx.splice(0, 1);
    return dx;
}

/**
 * Return the bounding box {min_x, min_y, max_x, max_y} of the object
 * @param {object|object[]} item One object
 * @param {boolean} three Whether it is 3D
 * @returns {any}
 */
export function get_bounding_box(item = [], three = false) {
    if (Array.isArray(item)) {
        let bound = item.map(i => get_bounding_box(i, three));
        return combine_bounding_box(bound, null, three);
    }
    else {
        if (three) update_three_parameters(item);
        else update_two_parameters(item);
        let bound = { min_x: Math.min(item.x0, item.x1), min_y: Math.min(item.y0, item.y1), max_x: Math.max(item.x0, item.x1), max_y: Math.max(item.y0, item.y1) };
        if (three) {
            bound.min_z = Math.min(item.z0, item.z1);
            bound.max_z = Math.max(item.z0, item.z1);
        }
        return bound;
    }
}

/**
 * Update the object from the b0 bounding box to the b1 bounding box
 * @param {any} item One object
 * @param {any} b0 Original bounding box
 * @param {any} b1 New bounding box
 * @param {boolean} three Whether the canvas is 3D
 * @returns {any}
 */
export function scale_bounding_box(item = { type: "none" }, b0 = { min_x: 0, min_y: 0, max_x: 1, max_y: 1 }, b1 = { min_x: 0, min_y: 0, max_x: 1, max_y: 1 }, three = false) {
    if (Array.isArray(item)) item.forEach(i => scale_bounding_box(i, b0, b1, three));
    else {
        if (three) update_three_parameters(item);
        else update_two_parameters(item);
        item.xc = scale_to(item.xc, b0.min_x, b0.max_x, b1.min_x, b1.max_x);
        item.yc = scale_to(item.yc, b0.min_y, b0.max_y, b1.min_y, b1.max_y);
        item.x0 = scale_to(item.x0, b0.min_x, b0.max_x, b1.min_x, b1.max_x);
        item.y0 = scale_to(item.y0, b0.min_y, b0.max_y, b1.min_y, b1.max_y);
        item.x1 = scale_to(item.x1, b0.min_x, b0.max_x, b1.min_x, b1.max_x);
        item.y1 = scale_to(item.y1, b0.min_y, b0.max_y, b1.min_y, b1.max_y);
        item.dx = scale_length_to(item.dx, b0.min_x, b0.max_x, b1.min_x, b1.max_x);
        item.dy = scale_length_to(item.dy, b0.min_y, b0.max_y, b1.min_y, b1.max_y);
        item.dx0 = scale_length_to(item.dx0, b0.min_x, b0.max_x, b1.min_x, b1.max_x);
        item.dy0 = scale_length_to(item.dy0, b0.min_y, b0.max_y, b1.min_y, b1.max_y);
        item.dx1 = scale_length_to(item.dx1, b0.min_x, b0.max_x, b1.min_x, b1.max_x);
        item.dy1 = scale_length_to(item.dy1, b0.min_y, b0.max_y, b1.min_y, b1.max_y);
        item.x = item.xc;
        item.y = item.yc;
        if (three) {
            item.zc = scale_to(item.zc, b0.min_z, b0.max_z, b1.min_z, b1.max_z);
            item.z0 = scale_to(item.z0, b0.min_z, b0.max_z, b1.min_z, b1.max_z);
            item.z1 = scale_to(item.z1, b0.min_z, b0.max_z, b1.min_z, b1.max_z);
            item.dz = scale_length_to(item.dz, b0.min_z, b0.max_z, b1.min_z, b1.max_z);
            item.z = item.zc;
        }
    }
}

/**
 * Scale the objects to the bounding box
 * @param {object[]} list List of objects
 * @param {string} canvas The canvas
 * @param {number} border The border
 * @param {boolean} three Whether the canvas is 3D
 * @returns {any}
 */
export function scale_bounding_box_to_canvas(list = [{ type: "none" }], canvas = "canvas", border = -1, three = false) {
    let bounds = get_bounding_box(list, three);
    let canvas_bounds = get_canvas_bounding_box(canvas, border, three);
    scale_bounding_box(list, bounds, canvas_bounds, three);
}

/**
 * Check if something is bounding box
 * @param {object} a The bounding box
 * @param {boolean} three Whether the canvas is 3D
 * @returns 
 */
export function is_bounding_box(a = {}, three = false) {
    let check = a.min_x != undefined && a.min_y != undefined && a.max_x != undefined && a.max_y != undefined;
    if (three) check = check && a.min_z != undefined && a.max_z != undefined;
    return check;
}

/**
 * Get combined bounding boxes
 * @param {object|object[]} a The first bounding box
 * @param {object} b The second bounding box
 * @param {boolean} three Whether the canvas is 3D
 * @param {boolean} fast Whether there are only two items
 * @returns {any}
 */
export function combine_bounding_box(a = { min_x: 0, min_y: 0, max_x: 1, max_y: 1 }, b = { min_x: 0, min_y: 0, max_x: 1, max_y: 1 }, three = false, fast = false) {
    if (!fast && Array.isArray(a)) return a.reduce((i, c) => combine_bounding_box(i, c, three, true), {});
    else {
        if (!is_bounding_box(a, three)) return b;
        else if (!is_bounding_box(b, three)) return a;
        else if (three) return { min_x: Math.min(a.min_x, b.min_x), min_y: Math.min(a.min_y, b.min_y), min_z: Math.min(a.min_z, b.min_z), max_x: Math.max(a.max_x, b.max_x), max_y: Math.max(a.max_y, b.max_y), max_z: Math.max(a.max_z, b.max_z) };
        else return { min_x: Math.min(a.min_x, b.min_x), min_y: Math.min(a.min_y, b.min_y), max_x: Math.max(a.max_x, b.max_x), max_y: Math.max(a.max_y, b.max_y) };
    }
}

/**
 * Scale vector x from [a, b] to [c, d]
 * @param {number} x The number
 * @param {number} a Old min
 * @param {number} b Old max
 * @param {number} c New min
 * @param {number} d New max
 * @returns {any}
 */
export function scale_to(x = 0, a = 0, b = 1, c = 0, d = 1) {
    if (a == b) return x;
    if (a > b) return scale_to(x, b, a, c, d);
    if (c > d) return scale_to(x, a, b, d, c);
    return (x - a) / (b - a) * (d - c) + c;
}

/**
 * Rescale matrix column by column
 * @param {number[][]} x Matrix
 * @param {number[]|number[][]} s Original scale (or combined scales)
 * @param {number[]|number[][]} d New scale
 * @returns 
 */
export function scale_mat_by_col(x = [[0]], s = [[0]], d = [[0]]) {
    if (d[0].length && d[0].length == s[0].length) return x.map(xi => xi.map((xij, j) => scale_to(xij, s[j][0], s[j][1], d[j][0], d[j][1])));
    else if (s[0].length) return x.map(xi => xi.map((xij, j) => scale_to(xij, s[j][0], s[j][1], d[0], d[1])));
    else return x.map(xi => xi.map(xij => scale_to(xij, s[0], s[1], d[0], d[1])));
}

export function scale_vec(x = [0], s = [[0]], d = [[0]]) {
    if (d[0].length && d[0].length == s[0].length) return x.map((xi, i) => scale_to(xi, s[i][0], s[i][1], d[i][0], d[i][1]));
    else if (s[0].length) return x.map((xi, i) => scale_to(xi, s[i][0], s[i][1], d[0], d[1]));
    else return x.map((xi, i) => scale_to(xi, s[0], s[1], d[0], d[1]));
}

/**
 * Scale length x from [a, b] to [c, d]
 * @param {number} x The number
 * @param {number} a Old min
 * @param {number} b Old max
 * @param {number} c New min
 * @param {number} d New max
 * @returns {any}
 */
export function scale_length_to(x = 0, a = 0, b = 1, c = 0, d = 1) {
    if (a == b) return x;
    if (a > b) return scale_to(x, b, a, c, d);
    if (c > d) return scale_to(x, a, b, d, c);
    return x / (b - a) * (d - c);
}

/**
 * Find the string closest to search string
 * @param {string} x The search string
 * @param {string[]|string[][]} list The vocabulary list
 * @param {number|number[]} index The column indices of the vocabulary list
 * @param {boolean} floor Previous word in the list
 * @param {boolean} sorted Whether list is sorted
 * @returns {any}
 */
export function auto_complete_index(x = "", list = [], index = -1, sep = ",", floor = false, sorted = false) {
    if (sorted) {
        let a = 0;
        let b = list.length - 1;
        let m = floor ? Math.floor((a + b) / 2) : Math.ceil((a + b) / 2);
        while (a < b) {
            let mid = list[m];
            if (x == mid) return m;
            else if (x < mid) b = m;
            else a = m;
            m = floor ? Math.floor((a + b) / 2) : Math.ceil((a + b) / 2);
        }
        return m;
    }
    else {
        let distance = [];
        if (typeof index == "number" && index < 0) distance = list.map(li => str_dist_start(x, li));
        else if (typeof index == "number") distance = list.map(li => str_dist_start(x, get_i(li, index, x)));
        else {
            let xi = x.split(sep);
            distance = list.map(li => index.reduce((s, ind, i) => s + (xi[i] ? str_dist_start(xi[i], li[ind]) : 0), 0));
        }
        return arg_min(distance);
    }
}

/**
 * Find weighted distance between two strings
 * @param {string} start The search string
 * @param {string} str The list string
 * @param {number} factor Relative importance of first letter
 * @param {number} base Smallest character index, 31 default, 96 only lower letters
 * @returns {any}
 */
export function str_dist_start(start = "", str = "", factor = 100, base = 31) {
    let n = Math.min(start.length, str.length);
    let np = Math.max(start.length, str.length);
    let sum = 0;
    for (let i = 0; i < np; i++) {
        if (i < n) sum += Math.abs(Math.abs(start.charCodeAt(i) - base) - Math.abs(str.charCodeAt(i) - base)) * Math.pow(factor, - i);
        else if (i < start.length) sum += Math.abs(start.charCodeAt(i) - base) * Math.pow(factor, - i);
        else if (i < str.length) sum += Math.abs(str.charCodeAt(i) - base) * Math.pow(factor, - i);
    }
    return sum;
}

export function get_check(name = "", def = false) {
    let box = get_elem(name);
    if (box) return box.checked;
    else return def;
}

/**
 * Get the true-false list of the check boxes
 * @param {string[]} boxes The list of field names
 * @param {boolean} fast Whether to check if boxes is an array
 * @returns {any}
 */
export function get_check_box(boxes = [""], fast = false) {
    if (!fast && Array.isArray(boxes)) return boxes.map(b => get_check_box(b, true));
    else {
        let box = get_elem(String(boxes));
        if (box) return box.checked;
        else return false;
    }
}

export function set_check_box(boxes = [""], check = true, fast = false) {
    if (!fast && Array.isArray(boxes) && Array.isArray(check)) boxes.forEach((b, i) => set_check_box(b, check[i], true));
    else if (!fast && Array.isArray(boxes)) boxes.forEach(b => set_check_box(b, check, true));
    else {
        let box = get_elem(String(boxes));
        if (box) box.checked = check;
    }
}

/**
 * Get the index of the elements of x equal to y
 * @param {any[]} x The list
 * @param {any} y Select which element
 * @param {any[]} def Default if no element
 * @param {number} shift Shift index by
 * @returns {any}
 */
export function get_index(x = [0], y = 0, def = [], shift = 0) {
    let list = x.reduce((s, xi, i) => xi == y ? [...s, i + shift] : s, []);
    if (list.length == 0) return def;
    else return list;
}

/**
 * Find the index of the sorted array
 * @param {any[]} x The list
 * @returns {any}
 */
export function index_sort(x = [], incr = true) {
    let len = x.length;
    if (len && len > 0) {
        let ind = seq(0, len - 1, 1);
        return ind.sort((a, b) => (incr ? 1 : -1) * (x[a] > x[b] ? 1 : (x[a] < x[b] ? -1 : 0)));
    }
}


export function push_index(list = [], start = 0, step = 1, cycle = true) {
    let last = list.slice(list.length - step);
    for (let i = list.length - step - 1; i >= start; i--) list[i + step] = list[i];
    if (cycle) last.forEach((l, i) => list[start + i] = l);
    return list;
}

/**
 * Map list by perm list[i] => perm[list[i]]
 * @param {number[]} list The index list
 * @param {number[]} perm The permutation i => perm[i]
 * @returns {any}
 */
export function map_index(list = [], perm = [], inverse = false) {
    if (!inverse) return list.map(l => (l < 0 || l >= perm.length) ? l : perm[l]);
    else return list.map(l => perm.includes(l) ? perm.indexOf(l) : l);
}

/**
 * Check if i is an index
 * @param {number} i The index
 * @param {any[]} list The list
 * @returns {any}
 */
export function is_index(i = 0, list = []) {
    return list.length && i >= 0 && i < list.length;
}

export function count_substring(s = "", sub = "") {
    return s.split(sub).length - 1;
}

export function incr_page(field = "", by = "1", check = "") {
    let cur = get_num(field_name(field));
    let incr = get_num(by);
    set_str(cur + incr, field_name(field));
    if (check != "" && cur + incr > 0) set_check_box(check, true);
    else if (check != "") set_check_box(check, false);
}

export function to_exam_page(field = "in", out = "out", left = "") {
    let lines = get_str(field, "", true).trim().split("\n");
    let result = "";
    let prefix = get_str(left);
    for (let line of lines) {
        let q = substring_between(substring_between(line, "@@", "{"), "", "-", true, true);
        let i = get_num(substring_between(line, ":", ")"), -1);
        let p = line.includes("////") ? substring_between(line, "////") : "";
        result += prefix + "q_" + q + "(gen, x[" + (i - 1) + "], id" + (p ? ", " + p : "") + ");\n";
    }
    set_str(result, out);
}

export function grade_set_up_page() {
    let fields = grade_get_fields();
    let locked = get_check_box(fields.set_up);
    if (!locked) {
        let names_str = get_str(fields.names);
        if (names_str.trim() == "") {
            split_fields(fields.inputs, fields.names + "," + fields.schemes + "," + fields.choices);
            names_str = get_str(fields.names);
        }
        let names = str_to_str_mat_line(names_str);
        names = names.filter(ni => ni[0].startsWith("\""));
        names = get_col(names, [0, 1, 2, 3, 4]);
        let centers = [];
        let tag = "";
        let sep = "\t";
        for (let i = 0; i < names.length; i++) {
            tag = names[i][0].trim().replace("\"", "") + ", " + names[i][1].trim().replace("\"", "");
            tag += sep + names[i][2];
            tag += sep + names[i][3];
            tag += sep + names[i][4];
            centers.push(tag);
        }
        set_global("grade", "prefix", centers);
        for (let i = 0; i < names.length; i++) {
            for (let j = 0; j < 5; j++)
                names[i][j] = names[i][j].toLowerCase().replace("\"", "").trim();
        }
        let schemes_list = str_to_str_vec(get_str(fields.schemes), "##");
        let q_list = [];
        let unique_q_list = [];
        let def_n = -1;
        schemes_list[schemes_list.length - 1] += "\n";
        for (let s of schemes_list) {
            let ind = s.indexOf("\n");
            if (ind >= 0) {
                let name = s.substring(0, ind).toLowerCase().trim();
                q_list.push(name);
                let unique_name = grade_scheme_name(name);
                if (!unique_q_list.includes(unique_name)) {
                    let scheme = str_to_str_mat_line(s.substring(ind).trim());
                    for (let si of scheme) {
                        let remaining = si.splice(3).join(",");
                        if (remaining.trim() != "") si[2] += "," + remaining;
                    }
                    scheme = scheme.map(si => si.map(sij => sij.trim()));
                    if (def_n <= 0) def_n = scheme.length;
                    set_global("grade", unique_name, scheme);
                    unique_q_list.push(unique_name);
                }
            }
        }
        set_global("grade", "questions", q_list);
        set_global("grade", "names", names);
        let name_search = get_elem("name");
        let question_search = get_elem("question");
        if (name_search) name_search.oninput = grade_search_name_page;
        if (question_search) question_search.oninput = grade_search_question_page;
        if (!get_global("grade", "choices")) {
            set_global("grade", "grades", zero_mat(names.length, q_list.length, 0));
            set_global("grade", "choices", zero_mat(names.length, q_list.length, [-1]));
            set_global("grade", "comments", zero_mat(names.length, q_list.length, []));
        }
        let choices = get_str(fields.choices);
        if (choices.trim() != "") {
            let lines = choices.split("\n\\\\\n");
            let mat = str_to_str_mat_line(lines[0]);
            let new_mat = zero_mat(names.length, q_list.length, [-1]);
            mat_copy_to(mat.map(mi => mi.map(mij => str_to_vec(mij, false, ";"))), new_mat);
            set_global("grade", "choices", new_mat);
            if (lines.length > 1) {
                mat = str_to_str_mat_line(lines[1], ",,");
                new_mat = zero_mat(names.length, q_list.length, []);
                mat_copy_to(mat.map(mi => mi.map(mij => str_to_str_vec(mij, ";;"))), new_mat);
                set_global("grade", "comments", new_mat);
            }
        }
        if (def_n > 1) set_str("1:" + def_n, fields.default[0]);
        set_str("1", fields.from_q);
        set_str("" + q_list.length, fields.to_q);
        set_str("1", fields.set_name);
        set_check_box(fields.set_up, true);
        grade_search_name_page();
        grade_search_question_page();
    }
}

export function grade_display_student(cn = -1, cq = -1) {
    let fields = grade_get_fields();
    let choices = get_global("grade", "choices");
    let comments = get_global("grade", "comments");
    let cur = 0;
    let com = "";
    for (let i = 1; i <= fields.total; i++) {
        set_check_box(fields.c + i, false);
        set_str(rep("??", count_substring(get_str(fields.m + i), "??")).join(""), fields.p + i);
        set_str("", fields.r + i);
    }
    for (let c in choices[cn][cq]) {
        if (choices[cn][cq][c] >= 0) {
            cur = Number(choices[cn][cq][c]) + 1;
            set_check_box(fields.c + cur, true);
            incr_page(fields.r + cur, 1);
            com = get_ijk(comments, cn, cq, c, "");
            set_str(rep("??", Math.max(count_substring(get_str(fields.m + cur), "??") - count_substring(com, "??"), 0)).join("") + com, fields.p + cur);
        }
    }
}

export function grade_search_name_page() {
    let fields = grade_get_fields();
    let name_col = get_str(fields.ind_name);
    if (name_col.includes(",")) name_col = str_to_vec(name_col, false);
    else name_col = Number(name_col);
    let name = get_str(fields.set_name);
    let names = get_global("grade", "names");
    let ind = -1;
    if (names) {
        if (isNaN(Number(name))) ind = auto_complete_index(name, names, name_col, ",", true, false);
        else if (String(name).trim() == "") ind = 0;
        else ind = Number(name) - 1;
        let display = vec_dot(names[ind], one_hot(name_col, names[0].length), ", ");
        set_str("-", fields.get_name);
        set_str(ind, fields.name);
        if (is_index(ind, names)) {
            set_str(display, fields.get_name);
            for (let i = 1; i <= fields.repeat; i++) set_str(display, fields.get_name + "_" + i);
            let cq = get_str(fields.q);
            cq = (cq == "-") ? -1 : Number(cq);
            if (cq >= 0) grade_display_student(ind, cq);
        }
    }
}

export function grade_search_question_page() {
    let fields = grade_get_fields();
    let question = get_str(fields.set_q);
    let questions = get_global("grade", "questions");
    let ind = -1;
    if (questions) {
        if (isNaN(Number(question))) ind = auto_complete_index(question, questions, -1, ",", true, false);
        else if (String(question).trim() == "") ind = 0;
        else ind = Number(question) - 1;
        set_str("-", fields.get_q);
        set_str(ind, fields.q);
        if (is_index(ind, questions)) {
            set_str(questions[ind], fields.get_q);
            for (let i = 1; i <= fields.repeat; i++) set_str(questions[ind], fields.get_q + "_" + i);
            let scheme = get_global("grade", grade_scheme_name(questions[ind]));
            for (let i = 1; i <= fields.total; i++) {
                for (let s of fields.scheme) set_str("", field_name(s + i));
            }
            scheme.forEach((s, q) => s.forEach((si, i) => set_str(si, fields.scheme[i] + (q + 1))));
            let cn = get_str(fields.name, "");
            cn = (cn == "-") ? -1 : Number(cn);
            if (cn >= 0) grade_display_student(cn, ind);
        }
    }
}

export function grade_default_page(number = "-1") {
    let fields = grade_get_fields();
    let defaults = [];
    if (number == "-1") {
        let cq = get_num(fields.q);
        if (cq >= 0) {
            let questions = get_global("grade", "questions");
            let scheme = get_global("grade", grade_scheme_name(questions[cq]));
            for (let i in scheme) {
                if (scheme[i][0] && String(scheme[i][0]).startsWith("*")) defaults.push(Number(i) + 1);
            }
        }
    }
    else defaults = str_to_index_list(get_str(fields.default[get_num(number, 0)]));
    set_check_box(str_seq(1, fields.total, 1, fields.c), false);
    if (defaults[0]) defaults.forEach(d => set_check_box(fields.c + d, true));
}

// 1 = select, -1 = deselect, 0 = flip
export function grade_check_page(type = "0") {
    let fields = grade_get_fields();
    let field_list = str_seq(1, fields.total, 1, fields.c);
    if (type == "-1") set_check_box(field_list, false);
    else {
        let checked = get_check_box(field_list);
        if (type == "0") {
            checked = checked.map((c, i) => get_str(fields.d + i).trim() == "" ? c : !c);
        }
        else {
            let start = false;
            for (let i in checked) {
                if (!start && checked[i]) start = true;
                else if (start && !checked[i] && get_str(fields.d + i).trim() != "") checked[i] = true;
                else if (start) start = false;
            }
        }
        set_check_box(field_list, checked);
    }
}

// 0 = sort, 1 = insert, -1 = cycle, -2 = unselect
export function grade_swap_page(type = "0") {
    let fields = grade_get_fields();
    let fields_list = str_seq(1, fields.total, 1, fields.s);
    let checks = get_check_box(fields_list);
    let indices = get_index(checks, true);
    if (indices.length > 0) {
        let q_list = get_global("grade", "questions");
        let cq = get_num(fields.q, -1);
        let choices = get_global("grade", "choices");
        if (q_list && is_index(cq, q_list)) {
            let q_name = grade_scheme_name(q_list[cq]);
            let scheme = get_global("grade", q_name);
            let perm = seq(0, scheme.length - 1, 1);
            if (type == "0") {
                let choice = get_col(choices, cq);
                let his = indices.map(ind => choice.reduce((s, c) => s + (c.includes(ind) ? 1 : 0), 0));
                let new_indices = get_row(indices, index_sort(his, false));
                indices.forEach((i, ind) => perm[i] = new_indices[ind]);
            }
            else if (type == "-1") indices.forEach((i, ind) => perm[i] = get_i(indices, ind - 1, 0, true));
            else if (type == "1") {
                let n_choice = indices.length;
                if (n_choice) {
                    perm = seq(0, scheme.length - 1 + n_choice, 1);
                    indices.forEach(i => push_index(perm, i));
                    indices.forEach(_ => scheme.push([""]));
                }
            }
            if (type == "0" || type == "-2") set_check_box(fields_list, false);
            set_global("grade", q_name, get_row(scheme, perm));
            for (let q in q_list) {
                if (grade_scheme_name(q_list[q]) == q_name) {
                    for (let c of choices) c[q] = map_index(c[q], perm, true);
                }
            }
        }
        grade_search_question_page();
    }
}

export function grade_next_page(move = "1", choice = "0") {
    let fields = grade_get_fields();
    let q_list = get_global("grade", "questions");
    let names = get_global("grade", "names");
    let choices = get_global("grade", "choices");
    let comments = get_global("grade", "comments");
    let cq = get_num(fields.q, -1);
    let cn = get_num(fields.name, -1);
    if (is_index(cq, q_list)) {
        let scheme = get_global("grade", grade_scheme_name(q_list[cq]));
        let scheme_map = i => fields.scheme.map(s => get_str(s + i));
        let c = get_num(choice, 0);
        if (c > 0 && !get_check_box(fields.only_one)) c = 0;
        if (is_index(cn, names) && c > 0) {
            choices[cn][cq] = [c - 1];
            comments[cn][cq] = [get_str(fields.p + c)];
        }
        else if (is_index(cn, names) && c == 0) {
            choices[cn][cq] = [];
            comments[cn][cq] = [];
            for (let i = 1; i <= fields.total; i++) {
                let ans = get_str(fields.c + i, "false");
                get_elem(fields.c + i).checked = false;
                if (ans == "true") {
                    let repeat = get_num(fields.r + i);
                    repeat = Math.floor(repeat);
                    if (repeat <= 0) repeat = 1;
                    for (let r = 0; r < repeat; r++) choices[cn][cq].push(i - 1);
                    comments[cn][cq].push(get_str(fields.p + i));
                    for (let r = 0; r < repeat - 1; r++) comments[cn][cq].push("");
                }
            }
            if (choices[cn][cq].length == 0) choices[cn][cq].push(-1);
        }
        for (let i = 1; i <= fields.total; i++) {
            if (get_str(fields.scheme[0] + i).trim() == "") break;
            scheme[i - 1] = scheme_map(i);
        }
        let move_num = get_num(move, 0);
        let from_q = get_num(fields.from_q, 0) - 1;
        let to_q = get_num(fields.to_q, 0) - 1;
        if (is_index(cn, names) && move_num != 0) {
            let move_student = false;
            if (from_q <= cq && cq <= to_q && is_index(from_q, q_list) && is_index(to_q, q_list)) {
                cq += move_num;
                if (cq < from_q) {
                    cq = to_q;
                    move_student = true;
                }
                else if (cq > to_q) {
                    cq = from_q;
                    move_student = true;
                }
            }
            else move_student = true;
            if (move_student) {
                cn += move_num;
                if (cn >= names.length) {
                    cn = 0;
                    cq = Math.min(cq + 1, q_list.length - 1);
                }
                else if (cn < 0) {
                    cn = names.length - 1;
                    cq = Math.max(cq - 1, 0);
                }
            }
            let w = get_str(fields.text_height);
            let h = get_str(fields.text_width);
            for (let i = 1; i <= fields.total; i++) {
                get_elem(fields.m + i).style.width = w;
                get_elem(fields.m + i).style.height = h;
                get_elem(fields.p + i).style.width = w;
                get_elem(fields.p + i).style.height = h;
            }
            set_str(cq + 1, fields.set_q);
            set_str(cn + 1, fields.set_name);
            grade_search_name_page();
            grade_search_question_page();
            get_elem(fields.set_name).select();
        }
    }
}

export function grade_revert_page() {
    let fields = grade_get_fields();
    let output = get_str(fields.outputs).trim();
    if (output) {
        let lines = output.split("\n");
        let title = lines[0].split("\t");
        let out = "## q1";
        let cur = 1;
        for (let t in title) {
            if (t > 1 && title[t] != "Grade" && title[t] != "Comment") out += "\n" + title[t] + ",0,";
            else if (t > 1 && title[t] == "Grade" && t < title.length - 2) {
                out += "\n\n## q" + cur;
                cur++;
            }
        }
        set_str(out, fields.schemes);
        out = "";
        for (let l in lines) {
            if (l > 0) {
                let score = lines[l].split("\t");
                let full_list = [];
                let part_list = [];
                cur = 0;
                for (let i in score) {
                    if (i > 1 && title[i] != "Grade" && title[i] != "Comment") {
                        for (let j = Number(score[i]); j > 0; j--) part_list.push(cur);
                        cur++;
                    }
                    else if (i > 1 && title[i] == "Grade") {
                        if (part_list.length > 0) full_list.push(part_list.join(";"));
                        else full_list.push("-1");
                        part_list = [];
                        cur = 0;
                    }
                }
                out += full_list.join(",") + "\n";
            }
        }
        set_str(out.trim(), fields.choices);
    }
}

export function grade_output_page() {
    let fields = grade_get_fields();
    let choices = get_global("grade", "choices");
    let p_comments = get_global("grade", "comments");
    let q_list = get_global("grade", "questions");
    let names = get_global("grade", "names");
    let prefix = get_global("grade", "prefix");
    let output = "";
    let sep = "\t";
    if (choices) {
        let count = 0;
        let out_scheme = "";
        let done_list = [];
        for (let q of q_list) {
            let q_name = grade_scheme_name(q);
            let scheme = get_global("grade", q_name);
            out_scheme += (out_scheme == "" ? "" : "\n\n") + "## " + q + (!done_list.includes(q_name) ? "\n" + mat_to_str_line(scheme) : "");
            done_list.push(q_name);
            let titles = get_col(scheme, 0);
            output += (count > 0 ? sep : "") + titles.join(sep);
            output += sep + "Grade" + sep + "Comment";
            count++;
        }
        output = "Student" + sep + "ID" + sep + "SIS User ID" + sep + "SIS Login ID" + sep + "Email" + "Total" + sep + "Comments" + sep + output;
        let com_sep = get_str(fields.com_sep, " ");
        let q_sep = get_str(fields.q_sep, "\n");
        let q_stop = "<-";
        let c_out = "";
        for (let c in choices) {
            let total = 0;
            let combine = "";
            count = 0;
            let line = "";
            let cur = "";
            c_out += names[c][0] + "_" + names[c][1] + "\n";
            for (let q in q_list) {
                let scheme = get_global("grade", grade_scheme_name(q_list[q]));
                let points = get_col(scheme, 1).map(get_num);
                let comments = get_col(scheme, 2);
                let n = scheme.length;
                let ones = one_hot(choices[c][q], n);
                line += (count > 0 ? sep : "") + ones.join(sep);
                let grad = vec_dot(ones, points);
                line += sep + grad;
                let adds = get_ij(p_comments, c, q, []);
                let com = vec_dot_comment(comments, ones, adds).trim();
                line += sep + com;
                combine += ((com == "" || combine == "") ? "" : " ") + com;
                cur = vec_dot_comment(comments, ones, adds, to_symbol(com_sep)).trim();
                c_out += cur.startsWith(q_stop) ? " " : to_symbol(q_sep) + cur;
                total += grad;
                count++;
            }
            output += "\n" + prefix[c] + sep + total + sep + combine + sep + line;
            c_out += "\n-----\n";
        }
        set_str(out_scheme, fields.schemes);
        let lines = mat_to_str_line(choices.map(ci => ci.map(cij => vec_to_str(cij, -1, ";", "", ""))), 0, ",");
        lines += "\n\\\\\n" + mat_to_str_line(p_comments.map(ci => ci.map(cij => vec_to_str(cij, -1, ";;", "", ""))), 0, ",,");
        set_str(lines, fields.choices);
        set_str(output, fields.outputs);
        set_str(c_out, fields.commenting);
    }
}

export function grade_extract_page(extract = 1) {
    let fields = grade_get_fields();
    let ex_q = get_check_box(fields.ex_q);
    let ex_c = get_check_box(fields.ex_c);
    if (ex_q || ex_c) {
        let cols = get_str(fields.extract).split(",");
        let q_list = get_global("grade", "questions");
        let col_names;
        let cq = 0;
        let scheme = [];
        if (ex_c) {
            cq = get_num(fields.q, -1);
            if (cols.length > 0 && is_index(cq, q_list)) {
                scheme = get_global("grade", q_list[cq]);
                col_names = scheme.map(s => substring_between(s[0], "(", ")", false, true).trim());
            }
            else col_names = [];
        }
        else col_names = q_list.map(s => s.trim());
        let ind;
        let ind_list = [];
        for (let cc of cols) {
            ind = get_num(cc, -1);
            if (ind < 0) ind = col_names.indexOf(cc.trim());
            else ind--;
            if (ind >= 0) ind_list.push(ind);
        }
        let choices = get_global("grade", "choices");
        let ys;
        if (extract >= 0) {
            if (ex_q) {
                ind_list = get_ind(choices[0], ind_list);
                ys = get_col(choices, ind_list);
                ys = ys.map(i => i.map(ij => ij.join(";")));
                set_str(mat_to_str_line(ys, 0, ","), fields.ex_out);
            }
            else {
                ys = get_col(choices, cq);
                ys = ys.map(i => one_hot(i, scheme.length));
                ind_list = get_ind(ys[0], ind_list);
                set_str(mat_to_str_line(get_col(ys, ind_list), 0, ","), fields.ex_out);
            }
        }
        else {
            if (ex_q) {
                ind_list = get_ind(choices[0], ind_list);
                ys = str_to_str_mat_line(get_str(fields.ex_out));
                ys = ys.map(yi => yi.map(yij => str_to_vec(yij, false, ";")));
                for (let cn in choices) {
                    for (let i in ind_list) {
                        if (is_index(ind_list[i], choices[cn])) choices[cn][ind_list[i]] = ys[cn][i];
                    }
                }
            }
            else {
                ys = str_to_mat_line(get_str(fields.ex_out));
                ys = ys.map(yi => map_index(one_hot_to_index_list(yi), ind_list, false));
                for (let cn in choices) choices[cn][cq].push(...ys[cn]);
            }
            grade_search_name_page();
            grade_search_question_page();
        }
    }
    set_check_box(fields.ex_q, false);
    set_check_box(fields.ex_c, false);
}

export function grade_aggregate_page() {
    let fields = grade_get_fields();
    let op = get_str(fields.aggregate);
    let list = get_str(fields.ex_out);
    if (!list.includes(";")) {
        list = str_to_mat_line(list);
        let out;
        if (op == "max") out = list.map(li => Math.max(...li));
        else if (op == "min") out = list.map(li => Math.min(...li));
        else if (op == "add") out = list.map(li => vec_sum(li));
        else if (op == "sub") out = list.map(li => li[1] - li[0]);
        else out = list.map(li => li[0]);
        set_str(out.join("\n", field.agg_out));
    }
}

export function grade_scheme_name(s = "") {
    return s.split(":")[0].trim();
}

export function grade_get_fields() {
    let fields = {
        q: "@id_q", name: "@id_name", set_q: "@question", set_name: "@name", repeat: 9,
        get_q: "@full_q", get_name: "@full_name", ind_q: "q_index", ind_name: "@names_index",
        names: "@names", schemes: "@scheme", choices: "@choices", inputs: "@input", outputs: "@output",
        from_q: "@from_q", to_q: "@to_q", d: "@d", c: "@c", m: "@m", r: "@r", p: "@p", s: "@s", scheme: ["@d", "@g", "@m"],
        com_sep: "@com_sep", q_sep: "@q_sep", commenting: "@commenting", set_up: "@locked",
        only_one: "@only_one", text_width: "@text_width", text_height: "@text_height",
        extract: "@extract", ex_q: "@ex_q", ex_c: "@ex_c", ex_out: "@extracted",
        aggregate: "@aggregate", agg_out: "@aggregated",
        default: ["@default_q0", "@default_q1", "@default_q2"], total: 99
    };
    return fields;
}

export function substring_between(s = "", oa = "", ob = "", first = true, complete = true) {
    let start = first ? s.indexOf(oa) : s.lastIndexOf(oa);
    let end = first ? s.indexOf(ob) : s.lastIndexOf(ob);
    let a = ((start < 0 && complete) ? "" : oa);
    let b = ((end < 0 && complete) ? "" : ob);
    let n = s.length;
    if (a == "" && b == "") return s;
    else if (a == "") return s.substring(0, end);
    else if (b == "") return s.substring(start < 0 ? n : start + oa.length, n);
    else return s.substring(start < 0 ? n : start + oa.length, end < 0 ? 0 : end);
}

export function to_symbol(s = "") {
    let str = s;
    if (s.includes("\\t")) str = str.replace("\\t", "\t");
    if (s.includes("\\n")) str = str.replace("\\n", "\n");
    return str;
}

/**
 * Convert [2, 1, 0] to [0, 0, 1]
 * @param {number[]} ones Zeroes and ones
 * @returns {any}
 */
export function one_hot_to_index_list(ones = []) {
    let list = [];
    for (let i in ones) {
        for (let j = ones[i]; j > 0; j--) list.push(Number(i));
    }
    return list;
}

/**
 * Combine the comments 1 * comment + 0 * (comment)
 * @param {string[]} comments Display 1 + Positive or 0 + Negative
 * @param {number[]} ones List of 0 or 1
 * @param {string[]} adds List of additions
 * @param {string} sep Separator to join the strings
 * @param {string} start Negative comment begin
 * @param {string} end Negative comment end
 * @returns {any}
 */
export function vec_dot_comment(comments = [], ones = [], adds = [], sep = " ", start = "(", end = ")", open = "(", close = ")", fill = "??") {
    let com = "", c = "", cur = "";
    let add = 0;
    let list = [], split = [];
    for (let i = 0; i < comments.length; i++) {
        c = comments[i];
        cur = "";
        if (ones[i] > 0 && !starts_with(c, start)) cur = get_str(c, "");
        else if (ones[i] == 0 && starts_with(c, start)) cur = substring(c, start.length, c.length - end.length);
        if (cur.includes("||")) {
            list = cur.split("||");
            cur = list[rand_int(0, list.length - 1)];
        }
        if (ones[i] > 0 && adds.length && adds.length > add) {
            split = adds[add].split(fill);
            if (split.length > 1) cur = str_replace(cur, fill, split.slice(1).map(s => s.trim()));
            if (split[0].trim() != "") cur = cur.trim() + " " + open + split[0].trim() + close;
            add++;
        }
        else cur = cur.trim();
        com += ((cur == "" || com == "") ? "" : sep) + cur;
    }
    return com;
}

export function substring(str = "", from = 0, to = str.length) {
    return typeof str == "string" ? str.substring(from, to) : String(str).substring(from, to);
}

export function combine_fields(files = "", combined = "") {
    let names = files.split(",");
    let list = [];
    names.forEach(n => list.push(get_str(n)));
    set_str(list.join("\n-----\n"), combined);
}

export function split_fields(combined = "", files = "") {
    let text = get_str(field_name(combined));
    let names = files.split(",");
    let list = text.split("\n-----\n");
    list.forEach((l, i) => set_str(l, i < names.length ? field_name(names[i]) : ""));
}

/**
 * Get the bounding box of the canvas
 * @param {any} canvas The canvas
 * @param {number} border The border
 * @param {boolean} three Whether the Canvas is 3D
 * @returns {any}
 */
export function get_canvas_bounding_box(canvas = "", border = -1, three = false) {
    if (three) {
        if (border < 0) border = 0.2;
        return { min_x: -1 + border, min_y: -1 + border, min_z: -1 + border, max_x: 1 - border, max_y: 1 - border, max_z: 1 - border };
    }
    else {
        canvas = field_name(canvas, false);
        let cvs = get_elem(canvas);
        if (!cvs) return { min_x: 0, min_y: 0, max_x: 1, max_y: 1 };
        let w = get_global("width", canvas, 0) || cvs.width;
        let h = get_global("height", canvas, 0) || cvs.height;
        if (border < 0) border = Math.min(w, h) * 0.1;
        else if (border < 1) border = Math.min(w, h) * border;
        return { min_x: 0 + border, min_y: 0 + border, max_x: w - border, max_y: h - border };
    }
}

//#region CS540 Core Functions
/**
 * Set up the questions
 * @param {function} q The list of functions
 * @returns {any}
 */
export function set_questions(q) {
    let questions = function (gen = false) {
        let id = get_id();
        if (id == "") id = "rand";
        if (q) q(gen, id);
        MathJax.typeset();
    };
    set_func("questions", questions);
    if (get_str("@id").trim() != "") gen_questions();
    else reorder_questions();
    let store = get_str("@store", "");
    if (store != "") {
        let list = get_str("@questions", "1,2,3,4,5,6,7,8,9,10").split(",");
        let perm = store.split(";");
        for (let p of perm) {
            let item = p.split(":");
            let index = list.indexOf(item[0]);
            list[index] = item[1];
        }
        set_global("id", "store", list);
    }
}

/**
 * Reorders the questions
 * @returns {any}
 */
export function reorder_questions() {
    let id = get_id();
    let order = get_global("id", "order");
    if (!order) order = get_str("@questions", "1,2,3,4,5,6,7,8,9,10").split(",");
    for (let i in order) {
        let div = get_elem("q" + order[i]);
        let span = get_elem("p" + (Number(i) + 1));
        if (div) div.style.display = (id ? "block" : "none");
        if (div && span) span.insertBefore(div, null);
    }
}

/**
 * Call the questions function
 * @returns {any}
 */
export function gen_questions() {
    let id = get_str("@id").trim();
    set_id(id);
    if (id != "") {
        set_str("ID: " + id, "id_warning");
        let order = get_str("@questions", "1,2,3,4,5,6,7,8,9,10").split(",");
        let random = get_str("@rand", "");
        if (random != "" && id != "test") {
            rand_seed(id);
            order = shuffle(order, order.length - 2);
        }
        set_global("id", "order", order);
        reorder_questions();
        let questions = get_func("questions");
        let message = "<font color=\"red\"> Error: the questions cannot be generated correctly.";
        message += "Try (1) refresh the page, (2) clear the browser cache, (3) switch to incognito/private browsing mode, (4) switch to another browser, (5) use a different ID.";
        message += "If none of these work, please post a private message on Piazza with your ID. </font>";
        if (questions) {
            try {
                questions(true);
            }
            catch (error) {
                console.log(error);
                set_str(message, "id_warning");
            }
        }
        else set_str(message, "id_warning");
    }
}

/**
 * Set the blanks for the questions
 * @param {string[]|string} id The field id = id_name
 * @param {(string|number)[]|string|number} s The string to set
 * @param {string} post The field postfix
 * @returns {any}
 */
export function set_blank(post = "name", id = [""], s = [""]) {
    let ids, str;
    if (is_vec(id)) ids = id.map(i => "@" + String(i) + "_" + String(post));
    else ids = "@" + String(id) + "_" + String(post);
    if (is_vec(s)) str = s.map(i => String(i));
    else str = String(s);
    set_str(str, ids);
}

/**
 * Set the choices for the questions
 * @param {(string|number)[]} list The choices to set
 * @param {string} post The field postfix
 * @returns {any}
 */
export function set_choices(post = "name", list = [""]) {
    let id = list.map((v, i) => "choice" + (i + 1));
    set_blank(post, id, list);
}

/**
 * Get the answer of the question
 * @param {string|number} ans The answer
 * @param {string} name Name of the question
 * @returns {any}
 */
export function set_ans(ans = "", name = "") {
    set_str(String(ans), "@answer" + "_" + name);
}

/**
 * Get the answer of the question
 * @param {string} ans The answer
 * @param {string} name Name of the question
 * @returns {any}
 */
export function set_state(ans = "", name = "") {
    set_str(ans, field_name(name) + "_state");
}

/**
 * Get the answer of the question
 * @param {string} name Name of the question
 * @returns {string}
 */
export function get_ans(name = "", id = 0) {
    return get_str("@answer" + (id <= 0 ? "" : id) + "_" + name, "").trim();
}

/**
 * Get the answer of the question
 * @param {string} name Name of the question
 * @returns {number[]}
 */
export function get_ans_vec(name = "", id = 0) {
    let str = get_str("@answer" + (id <= 0 ? "" : id) + "_" + name, "").trim();
    return str_to_str_vec(str, ",", "[", "]").map(i => Number(math_eval(i)));
}

/**
 * Get the answer as a graph (matrix) of the question
 * @param {string} name Name of the question
 * @param {boolean} selected Only output selected nodes
 * @returns {number[][]}
 */
export function get_ans_graph(name = "", selected = false) {
    let obj = get_canvas_objects("canvas_" + name);
    return get_graph_from_objects(obj, selected);
}

/**
 * Get the answer as a list of selected objects names of the question
 * @param {string} name Name of the question
 * @returns {string[]}
 */
export function get_ans_selected(name = "") {
    let obj = get_canvas_objects("canvas_" + name);
    return get_selected_from_objects(obj);
}

/**
 * Get the answer as a list of selected objects names of the question
 * @param {string} name Name of the question
 * @returns {number[][]}
 */
export function get_ans_grid(name = "") {
    let obj = get_canvas_objects("canvas_" + name);
    let grid = obj.find(o => o.type == "grid");
    return grid.mat;
}

/**
 * Get the total points of the question
 * @param {string} name Name of the question
 * @returns {number}
 */
export function get_total(name = "") {
    return get_num("@total_" + name, 0);
}

/**
 * Get the grade of the question
 * @param {string} name Name of the question
 * @returns {number}
 */
export function get_grade(name = "") {
    return get_num(get_global("grade", name), 0);
}

/**
 * Get the comment of the question
 * @param {string} name Name of the question
 * @returns {any}
 */
export function get_comment(name = "") {
    return get_str(get_global("comment", name, ""), "");
}

/**
 * Set the grade and comment of the question
 * @param {string} name Name of the question
 * @param {number} grades Partial grade to the question
 * @param {string} comment Partial comment for the question
 * @returns {any}
 */
export function set_grade(name = "", grades = 0, comment = "", clear = false) {
    if (clear) {
        set_global("grade", name, grades);
        set_global("comment", name, comment);
    }
    else {
        let g = get_grade(name) || 0;
        set_global("grade", name, g + grades);
        let c = get_comment(name) || "";
        set_global("comment", name, c + ((c != "" && String(comment).trim() != "") ? " " : "") + (c.includes(comment) ? "" : comment));
    }
}

/**
 * Check if an answer is correct
 * @param {number} ans The answer string
 * @param {number|number[]} solution The solution
 * @param {string} name The name of question
 * @param {number} total The total
 * @param {string} comment The comment
 * @returns {any}
 */
export function check_answer(ans = 0, solution = 0, name = "", total = 0, comment = "", round = -1) {
    let close = false;
    if (is_vec(solution)) close = solution.reduce((c, s) => c || close_to_ans(ans, s, round), false);
    else  close = close_to_ans(ans, solution, round);  
    if (close) set_grade(name, total, "");
    else set_grade(name, 0, comment);
}

/**
 * Grade a single question
 * @param {string} name The question name
 * @param {number|number[]} solution The numerical solution
 * @param {number} grades The grade if correct, -1 will search total field
 * @param {string} comment The comment if incorrect
 * @returns {any}
 */
export function grade_scalar(name = "", solution = 0, grades = -1, comment = "", round = -1) {
    let text = get_ans(name);
    let ans = get_num(text, Number.NaN, true, false);
    let gs = fix_grade(grades, name);
    if (text.trim() == "") check_answer(0, 1, name, gs[0], "Empty.");
    else if (isNaN(ans)) check_answer(0, 1, name, gs[0], "The expression [" + text + "] cannot be evaluated.");
    else check_answer(ans, solution, name, gs[0], comment, round);
}

/**
 * Grade a single question
 * @param {string} name The question name
 * @param {string} solution The numerical solution
 * @param {number} grades The grade if correct, -1 will search total field
 * @param {string} comment The comment if incorrect
 * @returns {any}
 */
export function grade_string(name = "", solution = "", grades = -1, comment = "") {
    let ans = get_str(name, "", true);
    let gs = fix_grade(grades, name);
    check_answer(ans == "" ? 0 : 1, 1, name, gs[0], comment);
}

/**
 * Give zero (or one)
 * @param {string} name The question name
 * @param {number|number[]} solution The numerical solution (0 or 1)
 * @param {number} grades The grade if correct, -1 will search total field
 * @param {string} comments The comment if incorrect
 * @returns {any}
 */
export function grade_binary(name = "", solution = 0, grades = -1, comments = "") {
    if (is_vec(solution)) {
        if (solution.length == 2) grade_vector(name, zero_vec(solution[1], Number.NaN), grades, comments);
        else if (solution.length == 3) grade_matrix(name, zero_mat(solution[1], solution[2], Number.NaN), grades, comments);
        else grade_binary(name, solution[0], grades, comments);
    }
    else {
        let gs = fix_grade(grades, name);
        let text = get_ans(name);
        if (text.trim() == "") check_answer(0, 1, name, gs[0], "Empty.");
        else check_answer(1, solution, name, gs[0], comments);
    }
}

/**
 * Grade a multiple choice question
 * @param {string} name The question name
 * @param {boolean[]} solutions The boolean solution
 * @param {number} grades The grade if correct, -1 will search total field
 * @param {string} comments The comment if incorrect
 * @returns {any}
 */
export function grade_choices(name = "", solutions = [false], grades = -1, comments = "") {
    let gs = fix_grade(grades, name);
    let any = solutions.reduce((s, i) => s || i, false);
    let cur = solutions.reduce((t, s, i) => (String(s) == get_ans(name, (i + 1))) ? t : t + 1, 0);
    let ans = get_ans(name, solutions.length + 1);
    console.log(cur, ans);
    if ((!any && ans != "true") || (any && ans == "true")) cur++;
    if (cur == 0) check_answer(cur, 0, name, gs[0], comments);
    else check_answer(cur, 0, name, gs[0], "Some choices are incorrect." + (comments.trim() == "" ? "" : " ") + comments.trim());
}

/**
 * Grade a vector answer question
 * @param {string} name The question name
 * @param {number[]} solution The numerical solution
 * @param {number[]|number} grades The grade if correct, -1 will search total field
 * @param {string} comments The comment if incorrect
 * @param {boolean} force Force the total grades
 * @returns {any}
 */
export function grade_vector(name = "", solution = [], grades = [], comments = "", force = false, round = -1, perm = false) {
    let ans = str_to_str_vec(get_ans(name), ",", "", "");
    if (ans.length != solution.length) grade_binary(name, 0, -1, incorrect_size_message(n_row(ans), solution.length));
    else {
        let gs = fix_grade(grades, name, solution.length);
        if (force) gs = zero_vec(solution.length, 1);
        let sp = perm ? sort(solution) : solution;
        let ap = ans.map(si => get_num(si, Number.NaN, true));
        ap = perm ? sort(ap) : solution;
        for (let s in sp) {
            let text = get_i(ans, s, "-");
            let si = get_num(text, Number.NaN, true);
            if (text.trim() == "") check_answer(0, 1, name, gs[s], "The expression for element " + (Number(s) + 1) + " is missing.");
            else if (isNaN(si)) check_answer(0, 1, name, gs[s], "The expression for element " + (Number(s) + 1) + " [" + text + "] cannot be evaluated.");
            else check_answer(ap[s], sp[s], name, gs[s], comments, round);
        }
    }
}

/**
 * Grade a vector answer question
 * @param {string} name The question name
 * @param {number[]} solution The numerical solution
 * @param {number} grades The grade if correct, -1 will search total field
 * @param {string} comments The comment if incorrect
 * @returns {any}
 */
export function grade_vector_as_scalar(name = "", solution = [], grades = -1, comments = "") {
    grade_vector(name, solution, [grades], comments, true);
    if (get_grade(name) < solution.length) set_grade(name, 0, get_comment(name), true);
    else set_grade(name, get_total(name), get_comment(name), true);
}

/**
 * Grade a matrix answer question
 * @param {string} name The question name
 * @param {number[][]} solution The numerical solution
 * @param {number|number[]} grades The grade if correct, -1 will search total field
 * @param {string} comments The comment if incorrect
 * @returns {any}
 */
export function grade_matrix(name = "", solution = [[]], grades = [], comments = "", force = false) {
    let ans = str_to_str_mat(get_ans(name), "\n", ",", "", "", "", "");
    if (ans.length != solution.length) grade_binary(name, 0, -1, incorrect_size_message(n_row(ans), solution.length, n_col(ans), solution[0].length));
    else {
        let check = ans.reduce((s, ai, i) => s && ai.length == solution[i].length, true);
        if (!check) grade_binary(name, 0, -1, incorrect_size_message(n_row(ans), solution.length, n_col(ans), solution[0].length));
        else {
            let cols = n_elem(solution);
            let gs = fix_grade(grades, name, cols);
            if (force) gs = zero_vec(cols, 1);
            let cu = 0;
            for (let i in solution) {
                for (let j in solution[i]) {
                    let text = get_ij(ans, i, j, "-");
                    let sij = get_num(text, Number.NaN, true);
                    if (text.trim() == "") check_answer(0, 1, name, gs[cu], "The expression for row " + (Number(i) + 1) + " column " + (Number(j) + 1) + " is missing.");
                    else if (isNaN(sij)) check_answer(0, 1, name, gs[cu], "The expression for row " + (Number(i) + 1) + " column " + (Number(j) + 1) + " [" + text + "] entered cannot be evaluated.");
                    else check_answer(sij, solution[i][j], name, gs[cu], comments);
                    cu++;
                }
            }
        }
    }
}

/**
 * Grade a matrix answer question
 * @param {string} name The question name
 * @param {number[][]} solution The numerical solution
 * @param {number} grades The grade if correct, -1 will search total field
 * @param {string} comments The comment if incorrect
 * @returns {any}
 */
export function grade_matrix_as_scalar(name = "", solution = [[]], grades = -1, comments = "") {
    grade_matrix(name, solution, [grades], comments, true);
    if (get_grade(name) < n_elem(solution)) set_grade(name, 0, get_comment(name), true);
    else set_grade(name, get_total(name), get_comment(name), true);
}

export function incorrect_size_message(n = 0, nc = 0, m = -1, mc = -1, larger = false) {
    if (mc == -1) return "Incorrect vector length: the vector should have length " + (larger ? "larger than " : "") + nc + ", the vector you entered has length " + n + ".";
    else return "Incorrect matrix size: the matrix should be " + (larger ? "larger than " : "") + nc + " x " + mc + ", the matrix you entered has size " + n + " x " + m + ".";
}

/**
 * Grade an expression answer question
 * @param {string} name The question name
 * @param {function} solution The numerical solution
 * @param {number} grades The grade if correct, -1 will search total field
 * @param {string} comment The comment if incorrect
 * @returns {any}
 */
export function grade_expr(name = "", solution = (y => y), x = "x", range = [-2, -1, 0, 0.1, 0.2, 0.4, 1, 2, 4], grades = -1, comment = "") {
    let ans = get_ans(name);
    let gs = fix_grade(grades, name);
    let correct = 0;
    for (let i in range) {
        if (close_to(Number(math_eval_at(ans, x, range[i])), solution(range[i]), 4)) correct++;
    }
    if (correct == range.length) check_answer(1, 1, name, gs[0], comment);
    else check_answer(1, 0, name, gs[0], comment);
}

/**
 * Grade the accuracy
 * @param {string} name The question name
 * @param {number[]} ans_y The answer
 * @param {number[]} true_y The solution
 * @param {number[]} levels Percentages
 * @returns {any}
 */
export function grade_accuracy(name = "", ans_y = [], true_y = [], levels = [0.5, 0.75, 0.85, 0.9, 0.95]) {
    if (ans_y.length != true_y.length) {
        set_ans(0, name);
        grade_binary(name, 0, -1, incorrect_size_message(ans_y.length, true_y.length));
    }
    else {
        let count = count_equal(ans_y, true_y);
        let t_acc = count / ans_y.length;
        let list = acc_to_list(t_acc, levels);
        set_ans(vec_to_str_line(list), name);
        grade_vector(name, acc_to_list(1, levels), -1, "Your accuracy is " + Math.floor(t_acc * 100) + "%. To get full points, the accuracy needs to be above " + Math.floor(levels[levels.length - 1] * 100) + "%.");
    }
}

/**
 * Convert accuracy to list
 * @param {number} acc The accuracy
 * @param {number[]} list The list
 * @returns {number[]}
 */
export function acc_to_list(acc = 0, list = [0]) {
    return list.map(i => (acc >= i) ? i : 0);
}

/**
 * Make sure the grades of the parts sum up to the total
 * @param {number|number[]} grades The grades
 * @param {string} name The question name
 * @param {number} len The number of parts
 * @returns {number[]}
 */
export function fix_grade(grades = [-1], name = "", len = -1) {
    let total = get_total(name);
    if (is_vec(grades)) {
        if (len <= 0 || total < 0) return [];
        else if (grades[0] == undefined || grades[0] < 0) return split_grade(total, len);
        else {
            let sum = grades.reduce((g, s) => s + Math.max(g, 0));
            let gs = grades.map(g => Math.round(Math.max(g, 0) / sum * total));
            let new_sum = gs.reduce((g, s) => s + g);
            gs[gs.length - 1] += new_sum - total;
            return gs;
        }
    }
    else {
        if (grades < 0 || grades > total) {
            if (len <= 1) return [total];
            else return split_grade(total, len);
        }
        else return [grades];
    }
}

/**
 * Split x into n equal integers, first few many 1 larger
 * @param {number} x Total grade
 * @param {number} n Number of questions
 * @returns {number[]}
 */
export function split_grade(x = 0, n = 1) {
    if (n <= 0) return [];
    let count = Math.floor(x / n);
    let remain = x - n * count;
    let grades = [];
    for (let i = 0; i < n; i++) {
        if (i < remain) grades.push(count + 1);
        else grades.push(count);
    }
    return grades;
}

/**
 * Hide an element
 * @param {string} name The name of the element
 * @returns {any}
 */
export function hide(name = "") {
    let element = get_elem(name);
    if (element) element.hidden = !element.hidden;
}

/**
 * The main grading function
 * @returns {number[]}
 */
export function grade() {
    return collect(true);
}

/**
 * The main grading export function (gives zero)
 * @returns {number[]}
 */
export function grade_zero() {
    return collect(false);
}

/**
 * The main grading function
 * @param {boolean} evaluate Whether to evaluate
 * @returns {number[]}
 */
export function collect(evaluate = true) {
    let grad = 0;
    let grades = [];
    let total = 0;
    let comment = "";
    let point = 0;
    let out_of = 0;
    let note = "ID: " + get_id() + get_br();
    let submit = get_elem("@submit_id");
    let names = get_global("id", "order", get_str("@questions", "1,2,3,4,5,6,7,8,9,10").split(","));
    let questions = get_func("questions");
    let message = get_id() + ":";
    try {
        questions(false);
    }
    catch (error) {
        console.log(error);
        note += "There is an error in grading. Please notify the instructor through email or private Piazza post." + get_br();
        note += "Error message: " + String(error).replace("\n", " ~ ") + get_br();
    }
    let assign = get_str("@assignment", "m0");
    let save = "##" + assign.charAt(0) + ": " + assign.substring(1) + "\n";
    save += "##id: " + get_id() + "\n";
    let store = get_global("id", "store", names);
    for (let i in names) {
        let index = Number(i) + 1;
        point = get_grade(names[i]) || 0;
        out_of = get_total(names[i]) || 0;
        comment = get_comment(names[i]) || "";
        save += "##" + index + ": " + save_ans(store[i]) + "\n";
        message += point + "/" + out_of + "+";
        if (evaluate && point >= out_of) note += "Question " + index + " is correct. (" + point + "/" + out_of + ")" + get_br();
        else if (evaluate) note += "Question " + index + " is incorrect. (" + point + "/" + out_of + ") " + comment.trim() + get_br();
        else note += "Question " + index + " is not graded. (" + 0 + "/" + out_of + ") " + comment.trim() + get_br();
        grades.push(point);
        grad += point;
        total += out_of;
        set_grade(names[i], 0, "", true);
        if (submit) {
            set_str(save_ans(names[i]), "@submit_a" + names[i]);
            set_str("" + point, "@submit_g" + names[i]);
        }
    }
    note += "Grade: " + (evaluate ? grad : "?") + " out of " + total + "." + get_br();
    message += "=" + grad + "/" + total;
    note += "Code: " + (evaluate ? gen_str(message) : "");
    set_str(note, "comment");
    set_str(save + "\n##0:\n" + str_replace(note, get_br(), "\n"), "output");
    if (submit) {
        set_str(get_id(), "@submit_id");
        set_str(assign.substring(1), "@submit_n");
        set_str("" + grad, "@submit_g");
    }
    grades.push(grad);
    set_str("", "submit_message");
    return grades;
}

export function kernel_demo_page(canvas = "canvas", scale = "scale", plane = "plane") {
    let objects = [];
    let n = 100;
    let x = rand(-10, 10, n, 3);
    let y = rep(0, n);
    for (let i = 0; i < n; i++) {
        x[i][2] = 0;
        y[i] = (x[i][0] * x[i][0] + x[i][1] * x[i][1] <= 6 * 6 ? 1 : 0);
    }
    let p = mat_to_points(x, y);
    objects.push({ type: "camera", x: 20, y: 0, z: 20 });
    objects.push({ type: "plane", wx: 0, wy: 0, wz: 1, b: 0, c0: "lightgray", c1: "lightgray" });
    objects.push(...p);
    let slider = get_elem(scale);
    slider.value = 0;
    slider.oninput = function () {
        let z = Number(slider.value);
        for (let i = 2; i < objects.length; i++) {
            let xi = x[i - 2][0];
            let yi = x[i - 2][1];
            objects[i].object.position.z = z / 50 * (xi * xi + yi * yi);
        }
    };
    let mover = get_elem("plane");
    mover.value = 0;
    mover.oninput = function () {
        let z = Number(mover.value);
        objects[1].object.position.z = z;
    };
    three_paint(canvas, objects);
}

/**
 * Save the answers
 * @param {string} name The field
 * @returns 
 */
export function save_ans(name = "") {
    let field = get_str("@answer_" + name);
    let ans = "";
    if (field) ans = get_str("@answer_" + name, "").split("\n").join(";;");
    else ans = "\n" + get_str(name, "", true);
    if (ans.trim() == "") {
        ans = get_str("@answer1_" + name, "");
        if (ans.trim() != "") {
            let choice = ans;
            let cur = 2;
            while (choice != "") {
                choice = get_str("@answer" + String(cur) + "_" + name, "");
                ans += (choice == "" ? "" : ";;") + choice;
                cur++;
            }
        }
    }
    return ans;
}

export function remove_pre_post(s = "", pre = "", post = "", trim = false) {
    let str = trim ? s.trim() : s;
    if (pre && str.startsWith(pre)) str = str.substring(pre.length);
    if (post && str.endsWith(post)) str = str.substring(0, str.length - post.length);
    return trim ? str.trim() : str;
}

export function load_blanks_page(file = "@loading") {
    let ans = get_str(file).split("\n");
    let cur_blank = "";
    let cur_ans = "";
    for (let line of ans) {
        if (line.startsWith("@")) {
            if (cur_blank != "") {
                set_str(cur_ans, cur_blank);
                if (cur_blank == "@id") gen_questions();
            }
            cur_blank = line;
            cur_ans = "";
        }
        else cur_ans += (cur_ans == "" ? "" : "\n") + line;
    }
    if (cur_blank != "") set_str(cur_ans, cur_blank);
}

export function midterm_load_and_grade_page() {
    let files = "@loadings";
    let file = "@loading";
    let list = "";
    let output = "";
    let all = get_str(files, "").split("$$$$$");
    if (all.length > 0) set_str(get_num("" + all[0].charAt(0), 0), "@version");
    for (let student in all) {
        set_str("", "@id");
        set_str(all[student], file);
        let grad = midterm_load_and_grade_single_page();
        if (grad.length) {
            if (grad.length > 10) {
                let id = grad.splice(grad.length - 2, 2);
                output += id[1] + "\t" + id[0] + "\n";
            }
            list += grad.join(",") + "\n";
        }
    }
    set_str(list.trim(), "@list");
    set_str(output, "@output");
}

export function get_qn() {
    let files = "@loadings";
    let all = get_str(files, "").split("$$$$$");
    let list = "";
    for (let student of all) {
        let ans = student.split("\n");
        let id = ans.find(a => a.startsWith("ID:"));
        if (id) {
            let temp = "";
            for (let s of ans) {
                if (temp == "" && s.trim().startsWith(get_str("@qn", "10") + ":")) {
                    temp = s.trim().substring(s.indexOf(":") + 1).trim();
                    if (temp.endsWith("<br>")) temp = temp.substring(0, temp.length - 4).trim();
                    list += temp + "\n";
                }
            }
            if (temp == "") list += "0\n";
        }
    }
    set_str(list, "@q9");
}

export function rpb(grades = [[0]], total = row_sum(grades)) {
    if (grades[0].length) {
        let r = zero_vec(grades[0].length, 0);
        return r.map((_, i) => rpb(get_col(grades, i), total));
    }
    else {
        let m0 = 0;
        let n0 = 0;
        let m1 = 0;
        let n1 = 0;
        let sd = Math.sqrt(variance(total, false));
        for (let g of grades) {
            if (g <= 0) {
                m0 += g;
                n0++;
            }
            else {
                m1 += g;
                n1++;
            }
        }
        return (m1 - m0) / sd * Math.sqrt(n0 * n1 / (n0 + n1) / (n0 + n1));
    }
}

export function hist(x = [0], n = -1) {
    if (n <= 0) return hist_int(x);
    else {
        let mx = Math.max(...x) + 0.1 / n;
        let mn = Math.min(...x);
        let dx = (mx - mn) / n;
        let list = zero_vec(n);
        x.forEach(xi => list[Math.floor((xi - mn) / dx)]++);
        return list;
    }
}

export function test_analysis(file = "@output", start = "0") {
    let g = str_to_mat_line(get_str(field_name(file)));
    let s = get_num(start, 0);
    for (let gi of g) gi.splice(0, s);
    let max = mat_max_by_col(g);
    g = g.map(gi => gi.map((gij, j) => gij / max[j]));
    let total = row_sum(g);
    console.log(g);
    let p = vec_mul(col_sum(g), 1 / g.length);
    let r = rpb(g, total);
    console.log(total, p, r);
}

export function midterm_load_and_grade_single_page() {
    let file = "@loading";
    let id = get_str("@id", "");
    let init = -1;
    let num = 0;
    if (id.trim() == "") {
        let ans = get_str(file).split("\n");
        id = ans.find(a => a.startsWith("ID:"));
        let vers = ans.find(a => a.startsWith("Initial:"));
        let hash = ans.find(a => a.startsWith("##:"));
        if (vers) init = remove_pre_post(vers, "Initial:", "<br>", true).trim().charCodeAt(0);
        if (hash) num = remove_pre_post(hash, "##:", "<br>", true).trim();
        if (id) id = remove_pre_post(id, "ID:", "<br>", true).trim();
    }
    let scheme = 0;
    if (!id) return 0;
    if (init < 0) init = id.charCodeAt(0);
    let version = get_num("@version", 0);
    let points = zero_vec(10, 4);
    for (let i = 0; i < points.length; i++) set_str(points[i], "@total_" + (i + 1));
    let exams1 = [[m1as20c1, m1as20c2, m1as20c3, m1as20c4],
    [m1bs20c1, m1bs20c2, m1bs20c3, m1bs20c4],
    [m2as20c1, m2as20c2, m2as20c3, m2as20c4],
    [m2bs20c1, m2bs20c2, m2bs20c3, m2bs20c4]];
    let exams2 = [[m1as20e1, m1as20e2, m1as20e3, m1as20e4],
    [m1bs20e1, m1bs20e2, m1bs20e3, m1bs20e4],
    [m2as20e1, m2as20e2, m2as20e3, m2as20e4],
    [m2bs20e1, m2bs20e2, m2bs20e3, m2bs20e4]];
    let exams3 = [[f1as20c1, f1as20c2, f1as20c3, f1as20c4],
    [f1bs20c1, f1bs20c2, f1bs20c3, f1bs20c4],
    [f2as20c1, f2as20c2, f2as20c3, f2as20c4],
    [f2bs20c1, f2bs20c2, f2bs20c3, f2bs20c4]];
    let exams4 = [[f1as20e1, f1as20e2, f1as20e3, f1as20e4],
    [f1bs20e1, f1bs20e2, f1bs20e3, f1bs20e4],
    [f2as20e1, f2as20e2, f2as20e3, f2as20e4],
    [f2bs20e1, f2bs20e2, f2bs20e3, f2bs20e4]];
    let perm = [];
    let perms1 = [[[5, 8, 9, 7, 4, 2, 3, 6, 1],
    [4, 7, 8, 9, 6, 5, 3, 1, 2],
    [3, 7, 2, 9, 8, 5, 1, 4, 6],
    [5, 2, 4, 9, 3, 8, 7, 6, 1]],
    [[9, 8, 5, 6, 3, 1, 7, 4, 2],
    [8, 5, 7, 3, 2, 9, 6, 4, 1],
    [2, 1, 9, 6, 4, 5, 3, 8, 7],
    [4, 2, 6, 3, 8, 9, 7, 5, 1]],
    [[3, 6, 7, 1, 2, 4, 5, 9, 8],
    [3, 2, 6, 1, 8, 9, 5, 7, 4],
    [3, 4, 2, 1, 9, 8, 6, 5, 7],
    [5, 8, 1, 2, 9, 7, 3, 4, 6]],
    [[9, 7, 2, 8, 6, 1, 3, 5, 4],
    [4, 5, 8, 1, 6, 9, 7, 3, 2],
    [5, 3, 9, 1, 4, 6, 2, 7, 8],
    [6, 8, 7, 1, 5, 3, 9, 2, 4]]];
    let perms2 = [[[1, 7, 8, 6, 5, 4, 3, 9, 2],
    [7, 8, 6, 4, 1, 5, 3, 9, 2],
    [6, 3, 4, 5, 9, 8, 2, 7, 1],
    [8, 3, 6, 9, 5, 4, 2, 7, 1]],
    [[5, 1, 8, 7, 4, 3, 6, 9, 2],
    [4, 2, 8, 7, 1, 9, 5, 3, 6],
    [5, 1, 4, 2, 7, 8, 9, 6, 3],
    [5, 7, 8, 2, 9, 4, 3, 6, 1]],
    [[2, 7, 3, 1, 5, 9, 8, 6, 4],
    [5, 2, 3, 4, 1, 9, 8, 6, 7],
    [6, 1, 2, 3, 8, 5, 7, 4, 9],
    [6, 9, 1, 7, 2, 4, 3, 8, 5]],
    [[6, 8, 3, 5, 4, 7, 2, 1, 9],
    [1, 2, 9, 6, 8, 3, 4, 7, 5],
    [1, 7, 3, 5, 4, 9, 8, 2, 6],
    [1, 9, 7, 8, 3, 4, 5, 2, 6]]];
    let perms3 = [[[7, 6, 8, 3, 5, 2, 1, 9, 4],
    [2, 6, 7, 4, 5, 9, 1, 3, 8],
    [2, 7, 8, 3, 4, 9, 5, 1, 6],
    [2, 5, 9, 1, 6, 3, 8, 4, 7]],
    [[8, 5, 1, 4, 2, 9, 3, 7, 6],
    [4, 2, 1, 3, 5, 6, 9, 7, 8],
    [3, 2, 4, 5, 7, 6, 8, 9, 1],
    [7, 4, 2, 6, 5, 8, 3, 9, 1]],
    [[4, 5, 8, 3, 1, 7, 6, 2],
    [5, 8, 7, 2, 1, 3, 6, 4],
    [5, 4, 2, 6, 1, 8, 3, 7],
    [3, 7, 2, 4, 1, 5, 6, 8]],
    [[4, 2, 3, 5, 1, 8, 6, 7],
    [1, 6, 7, 4, 5, 2, 3, 8],
    [5, 6, 2, 4, 7, 1, 8, 3],
    [6, 8, 3, 2, 5, 1, 4, 7]]];
    let perms4 = [[[7, 6, 8, 3, 5, 2, 1, 9, 4],
    [2, 6, 7, 4, 5, 9, 1, 3, 8],
    [2, 7, 8, 3, 4, 9, 5, 1, 6],
    [2, 5, 9, 1, 6, 3, 8, 4, 7]],
    [[8, 5, 1, 4, 2, 9, 3, 7, 6],
    [4, 2, 1, 3, 5, 6, 9, 7, 8],
    [3, 2, 4, 5, 7, 6, 8, 9, 1],
    [7, 4, 2, 6, 5, 8, 3, 9, 1]],
    [[4, 5, 8, 3, 1, 7, 6, 2],
    [5, 8, 7, 2, 1, 3, 6, 4],
    [5, 4, 2, 6, 1, 8, 3, 7],
    [3, 7, 2, 4, 1, 5, 6, 8]],
    [[4, 2, 3, 5, 1, 8, 6, 7],
    [1, 6, 7, 4, 5, 2, 3, 8],
    [5, 6, 2, 4, 7, 1, 8, 3],
    [6, 8, 3, 2, 5, 1, 4, 7]]];
    let exams = exams4;
    let perms = perms4;
    if (init >= "a".charCodeAt(0) && init <= "g".charCodeAt(0)) {
        scheme = exams[version][0];
        perm = perms[version][0];
    }
    else if (init >= "h".charCodeAt(0) && init <= "n".charCodeAt(0)) {
        scheme = exams[version][1];
        perm = perms[version][1];
    }
    else if (init >= "o".charCodeAt(0) && init <= "t".charCodeAt(0)) {
        scheme = exams[version][2];
        perm = perms[version][2];
    }
    else if (init >= "u".charCodeAt(0) && init <= "z".charCodeAt(0)) {
        scheme = exams[version][3];
        perm = perms[version][3];
    }
    else {
        scheme = exams[version][4];
        perm = perms[version][4];
    }
    let list = load_and_grade(file, scheme);
    let new_list = reverse_permute(list, perm);
    new_list.push(num);
    return new_list;
}

export function reverse_permute(x = [0], pi = [0]) {
    let reverse = vec_clone(x);
    for (let i = 0; i < pi.length; i++) reverse[i] = x[pi[i]];
    return reverse;
}

export function load_and_grade(file = "@loading", scheme = _ => "") {
    scheme();
    load_ans_page(file);
    return grade();
}

export function grade_sort_page() {
}

export function load_grade_page(file = "@loading", out = "@list") {
    let ans = get_str(file).split("\n");
    let result = "";
    for (let i = 1; i < ans.length; i ++) {
        let list = ans[i].split("\t");
        let id = list[1];
        set_str(id, "id");
        get_global("exams", list[2])();
        let points = get_global("points", list[2]);
        for (let j = 1; j <= 15; j ++) {
            set_str(points[j - 1], "total_" + j);
            load_ans(String(j), list[j + 2]);
        }
        let grades = grade();
        result += grades.join("\t") + "\n";
    }
    set_str(result, out);
}

/**
 * Load the answers
 * @param {string} file Text field to load the answers
 */
export function load_ans_page(file = "@loading") {
    let ans = get_str(file).split("##");
    let set = false;
    let list = get_str("@questions", "1,2,3,4,5,6,7,8,9,10").split(",");
    let order = [];
    let store = [];
    for (let a of ans) {
        let cur = a.trim();
        let sep = cur.indexOf(" ") > 0 ? Math.min(cur.indexOf(":"), cur.indexOf(" ")) : cur.indexOf(":");
        let name = cur.substring(0, sep).toLowerCase();
        let content = cur.substring(sep + 1).trim();
        if (name == "id") {
            set_str(content, "id");
            gen_questions();
            set = true;
            order = get_global("id", "order", list);
            order = get_global("id", "store", order);
        }
        else if (set && name != "0") load_ans(order[Number(name) - 1], content);
    }
}

/**
 * Load the answers back to a question
 * @param {string} name The name of the question
 * @param {string} line The line to load
 */
export function load_ans(name = "", line = "") {
    let field = get_elem("@answer_" + name);
    let text = get_elem(name);
    if (field) {
        let ans = line.split(";;").join("\n");
        if (ans.trim() != "") {
            set_ans(ans, name);
            let type = get_str("@load_" + name).trim();
            if (starts_with(type, ["graph", "line", "grid", "select"])) {
                let canvas = "canvas_" + name;
                let objects = get_canvas_objects(canvas);
                if (type == "graph") {
                    let graph = mat_to_digraph(str_to_mat_line(ans));
                    scale_bounding_box_to_canvas(graph, "canvas_" + name);
                    for (let item of graph) {
                        if (item.type == "node") {
                            let match = get_object_by_value(objects, "id", item.id);
                            if (match.length) item.name = match[0].name;
                        }
                    }
                    objects.length = 0;
                    objects.push(...graph);
                }
                else if (type == "line") {
                    let vec = str_to_vec(ans, false, ",");
                    remove_object_by_type(objects, "line");
                    objects.push({ type: "line", x0: vec[0], y0: vec[1], x1: vec[2], y1: vec[3] });
                }
                else if (type == "grid") {
                    let grid = get_object_by_type(objects, "grid");
                    if (grid.length) grid[0].mat = str_to_mat_line(ans, false);
                }
                else if (type == "select") {
                    let mat = str_to_mat_line(ans, false);
                    for (let obj of objects) {
                        if (obj.type == "node") {
                            let id = get_num(obj.id, 0);
                            if (mat[id][id]) obj.selected = true;
                        }
                        else if (obj.type == "edge") {
                            let ids = obj.id.split("-");
                            let id1 = get_num(ids[0], 0);
                            let id2 = get_num(ids[1], 0);
                            if (id1 != id2 && mat[id1][id2]) obj.selected = true;
                        }
                    }
                }
                refresh_paint(canvas);
            }
        }
    }
    else if (text) set_str(line, name);
    else {
        let choices = line.split(";;");
        for (let i in choices) {
            let box = get_elem("@answer" + String(1 + Number(i)) + "_" + name);
            if (box) box.checked = choices[i].trim().toLowerCase().startsWith("t");
        }
    }
}
//#endregion




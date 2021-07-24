
let objects = [];
let lines = [];

function automata() {
    set_str("automata", "canvas_state");
    paint("canvas", lines, objects, "shadow");
}

function gen_tex() {
    vertices = objects.filter(v => v.type == "node");
    edges = objects.filter(e => e.type == "edge");
    set_str(to_def_automata(), "definition");
    set_str(to_tex_automata(), "automata");
    set_str(to_tex_graph(), "graph");
    set_str(to_tex_graph_for(), "graph_for");
    set_str(to_tex_lines(), "lines");
}

function gen_label() {
    let inputs = get_str("$input").split("\n");
    let mat = get_matrix();
    if (inputs.length > 0) {
        let sigma = list_vocab(inputs);
        console.time('enum');
        let label = enum_transition(mat, sigma, inputs);
        console.timeEnd('enum');
        update_all_names(label);
    }
}

function list_vocab(input = [""]) {
    let list = new Set();
    for (let i of input) {
        let split = i.split('');
        for (let s of split) list.add(s);
    }
    return Array.from(list);
}

function to_transition() {
    let transition = object.filter(e => e.type == "edge");
    let n_state = objects.filter(v => v.type == "node").length;
    let mat = Array(n_state).fill().map(() => Array(n_state).fill(0));
    for (let e of transition) mat[e.id0][e.id1] = 1;
    return mat;
}

function power_set(s = ["a"]) {
    let n = s.length;
    let pow = [[]];
    for (let i = 0; i < n; i++) {
        let len = pow.length;
        for (let j = 0; j < len; j++) {
            pow.push(pow[j].concat(s[i]));
        }
    }
    pow = pow.sort((a, b) => (a.length - b.length));
    pow.splice(0, 1);
    return pow;
}

function seq(a = 0, b = 1) {
    return Array(b - a + 1).fill().map((v, i) => i + a);
}

function cart_product() {
    return Array.prototype.reduce.call(arguments, function (a, b) {
        var ret = [];
        a.forEach(function (a) {
            b.forEach(function (b) {
                ret.push(a.concat([b]));
            });
        });
        return ret;
    }, [[]]);
}

function list_perm(a = 0, b = 1, n = 5) {
    let s = seq(a, b);
    let f = Array(n).fill(s);
    let c = cart_product(...f);
    c = c.map(e => [e.reduce((p, i) => p + i, 0), e]);
    c = c.sort((a, b) => a[0] - b[0]);
    c = c.map(e => e[1]);
    return c;
}

function enum_transition(mat0 = [[0]], sigma = ["a"], input = ["a"]) {
    let n_edges = mat0.reduce((s, e) => s + e.reduce((ss, f) => f + ss, 0), 0);
    let n_state = mat0.length;
    let mat = Array(n_state).fill().map(() => Array(n_state).fill(""));
    let power = power_set(sigma);
    let perm = list_perm(0, power.length - 1, n_edges);
    for (let k of perm) {
        let cur = 0;
        for (let i in mat0) {
            for (let j in mat0[i]) {
                if (mat0[i][j] == 1) {
                    let ck = power[k[cur]];
                    let name = ck.reduce((s, i) => s + "|" + i, "");
                    mat[i][j] = trim_symbol(name, "|");
                    cur++;
                }
            }
            //if (mat[i][i] == "") mat[i][i] += "#";
            //else mat[i][i] += "|#";
        }
        let reg = to_regex(mat);
        let check = true;
        for (let i of input) {
            if (!reg.test(i)) check = false;
        }
        if (check) return mat;
    }
    return mat;
}

function add_bracket(s = "", d = "") {
    if (s.length == 1) return s + d;
    else return "(" + s + ")" + d;
}

function to_regex(mat = [["#"]], init = 0, acc = mat.length - 1) {
    let n_state = mat.length;
    let mat1 = Array(n_state).fill().map(() => Array(n_state).fill(0));
    for (let k = 0; k < n_state; k++) {
        for (let i = 0; i < n_state; i++) {
            for (let j = 0; j < n_state; j++) {
                let t1 = mat[i][k];
                let t2 = mat[k][k];
                let t3 = mat[k][j];
                let t4 = mat[i][j];
                if (t1 == "" || t2 == "" || t3 == "") mat1[i][j] = t4;
                else {
                    t5 = "";
                    if (t1 == t2 && t1 == t3) t5 = add_bracket(t1, "*");
                    else if (t1 == t2) t5 = add_bracket(t1, "*") + add_bracket(t3);
                    else if (t2 == t3) t5 = add_bracket(t1) + add_bracket(t3, "*");
                    else t5 = add_bracket(t1) + add_bracket(t2, "*") + add_bracket(t3);
                    if (t4 == "" || t4 == t3 || t4 == t1) mat1[i][j] = t5;
                    else mat1[i][j] = t5 + "|" + t4;
                }
            }
        }
        for (let i = 0; i < n_state; i++) {
            for (let j = 0; j < n_state; j++) {
                mat[i][j] = mat1[i][j];
            }
        }
    }
    return RegExp("^" + mat[init][acc] + "$");
}

function to_def_automata() {
    let s = "The automata is (Q, &Sigma;, &Delta;, q&#8320;, F):" + get_br();
    s += "Q: {";
    vertices.forEach(v => s += to_subscript(v.name) + ", ");
    s = trim_symbol(s, ",");
    s += "}" + get_br();
    s += "&Sigma;: {";
    let alpha = new Set();
    for (let e of edges) {
        if (e.name.indexOf("->") < 0) {
            let al = e.name.split(",");
            for (let a of al) alpha.add(a.trim());
        }
    }
    alpha.forEach(a => s += a + ", ");
    s = trim_symbol(s, ",");
    s += "}" + get_br();
    s += "&Delta;: defined below" + get_br();
    for (let e of edges) {
        let em0 = e.name0;
        let em1 = e.name1;
        for (let v of vertices) {
            if (v.id == e.id0) em0 = v.name;
            if (v.id == e.id1) em1 = v.name;
        }
        let pieces = e.name.split(",");
        for (let p of pieces) s += "(" + to_subscript(em0) + ", " + to_subscript(p) + ") " + String.fromCharCode(8594) + " " + to_subscript(em1) + get_br();
    }
    s += "q&#8320;: {";
    vertices.forEach(v => s += (v.initial !== undefined ? to_subscript(v.name) + ", " : ""));
    s = trim_symbol(s, ",");
    s += "}" + get_br();
    s += "F: {";
    vertices.forEach(v => s += (v.accept ? to_subscript(v.name) + ", " : ""));
    s = trim_symbol(s, ",");
    s += "}" + get_br();
    return s;
}

function trim_symbol(s = "", r = "") {
    let front = 0;
    for (let i in s) {
        if (r.indexOf(s.charAt(i)) >= 0 || s.charAt(i) == ' ') front++;
        else break;
    }
    let back = 0;
    for (let i in s) {
        if (r.indexOf(s.charAt(s.length - 1 - i)) >= 0 || s.charAt(s.length - 1 - i) == ' ') back++;
        else break;
    }
    return s.substring(front, s.length - back);
}

function find_relations() {
    if (vertices.length > 0) {
        let directions = ["left", "below left", "below", "below right", "right", "above right", "above"];
        vertices[0].relation = "";
        for (let i in vertices) {
            if (i > 0) {
                let cv = vertices[i];
                let pv = vertices[i - 1];
                let min_dist = norm_vec(cv, pv);
                for (let j = 0; j < i; j++) {
                    let dist = norm_vec(cv, vertices[j]);
                    if (dist < min_dist) {
                        min_dist = dist;
                        pv = vertices[j];
                    }
                }
                let angle = get_angle(cv.x, cv.y, pv.x, pv.y);
                angle = round_to_direction(angle);
                cv.relation = ", " + directions[(angle + 360) % 360 / 45] + " of = q" + pv.id;
            }
        }
    }
}

function to_tex_automata() {
    let s = "\\begin{figure}[ht]" + get_br();
    s += "\\centering" + get_br();
    s += "\\begin\{tikzpicture\}" + get_br();
    find_relations();
    for (let v of vertices) {
        let state = "";
        if (v.initial !== undefined) state = ", initial";
        if (v.accept) state = ", accepting";
        s += get_tab() + "\\node[state" + v.relation + state + "] (q" + v.id + ") {$" + v.name + "$};" + get_br();
    }
    if (edges.length > 0) s += get_tab() + "\\draw " + get_tab();
    let count = 1;
    for (let e of edges) {
        let connect = "";
        if (e.id0 == e.id1) {
            if (e.a == 0) connect = "loop right";
            else if (e.a == 90) connect = "loop above";
            else if (e.a == -90) connect = "loop below";
            else connect = "loop left";
        }
        else {
            if (e.a == -45) connect = "bend right";
            else if (e.a == 45) connect = "bend left";
            else connect = "";
        }
        if (count !== 1) s += get_tab() + get_tab() + get_tab();
        s += "(q" + e.id0 + ") edge[" + connect + "] node[fill = white]{$" + e.name.replace("->", "\\rightarrow") + "$} (q" + e.id1 + ")";
        if (count != edges.length) s += get_br();
        count++;
    }
    if (edges.length > 0) s += ";" + get_br();
    s += "\\end\{tikzpicture\}" + get_br();
    s += "\\caption{Automata}" + get_br();
    s += "\\label{fig:dfa}" + get_br();
    s += "\\end{figure}" + get_br();
    return s;
}

function to_tex_graph() {
    let unit_size = get_size("latex");
    let s = "\\begin{figure}[ht]" + get_br();
    s += "\\centering" + get_br();
    s += "\\begin\{tikzpicture\}" + get_br();
    for (let e of edges) {
        let bend = "";
        if (e.a < 0) bend = "[bend right = " + (-e.a) + "] ";
        else if (e.a > 0) bend = "[bend left = " + (e.a) + "] ";
        s += get_tab() + "\\draw " + to_points(e.x0, e.y0) + " to " + bend + to_points(e.x1, e.y1) + ";" + get_br();
    }
    for (let v of vertices) {
        s += get_tab() + "\\draw[fill = white] " + to_points(v.x, v.y) + " circle [radius = " + unit_size + "];" + get_br();
    }
    s += "\\end\{tikzpicture\}" + get_br();
    s += "\\caption{Graph}" + get_br();
    s += "\\label{fig:graph}" + get_br();
    s += "\\end{figure}" + get_br();
    return s;
}

function to_tex_graph_for() {
    let unit_size = get_size("latex");
    let s = "\\begin{figure}[ht]" + get_br();
    s += "\\centering" + get_br();
    s += "\\begin\{tikzpicture\}" + get_br();
    for (let e of edges) {
        let bend = "";
        if (e.a < 0) bend = "[bend right = " + (-e.a) + "] ";
        else if (e.a > 0) bend = "[bend left = " + (e.a) + "] ";
        s += get_tab() + "\\draw " + to_points(e.x0, e.y0) + " to " + bend + to_points(e.x1, e.y1) + ";" + get_br();
    }
    grids = objects.filter(e => e.type == "grid");
    for (let g of grids) {
        if (g.fx > 0) s += get_tab() + "\\foreach \\x in {0, ..., " + g.fx + "}" + get_br();
        if (g.fy > 0) s += get_tab() + get_tab() + "\\foreach \\y in {0, ..., " + g.fy + "}" + get_br();
        s += get_tab() + get_tab() + get_tab() + "\\draw[fill = white] (";
        if (g.fx > 0) s += to_addition(g.x, g.dx) + " * \\x";
        else s += to_addition(g.x, -1);
        s += ", ";
        if (g.fy > 0) s += to_addition(g.y, g.dy) + " * \\y";
        else s += to_addition(g.y, -1);
        s += ") circle [radius = " + unit_size + "];" + get_br();
    }
    s += "\\end\{tikzpicture\}" + get_br();
    s += "\\caption{Graph}" + get_br();
    s += "\\label{fig:graph}" + get_br();
    s += "\\end{figure}" + get_br();
    return s;
}

function to_tex_lines() {
    let s = "\\begin{figure}[ht]" + get_br();
    s += "\\centering" + get_br();
    s += "\\begin\{tikzpicture\}" + get_br();
    if (lines.length > 0) {
        for (let line of lines) {
            s += "\\draw ";
            s += to_points(line[0].x, line[0].y);
            for (let i in line) {
                if (i > 0) s += " -- " + to_points(line[i].x, line[i].y);
            }
            s += ";" + get_br();
        }
    }
    s += "\\end\{tikzpicture\}" + get_br();
    s += "\\caption{Drawing}" + get_br();
    s += "\\label{fig:drawing}" + get_br();
    s += "\\end{figure}" + get_br();
    return s;
}

function to_addition(x0 = 0, y0 = 0) {
    let unit_size = get_size("latex");
    let node_size = get_size("node");
    let x = x0 * unit_size / node_size;
    let y = y0 * unit_size / node_size;
    if (y0 < 0) return x.toFixed(2);
    else return x.toFixed(2) + " + " + y.toFixed(2);
}

function to_points(x0 = 0, y0 = 0) {
    let unit_size = get_size("latex");
    let node_size = get_size("node");
    let x = x0 * unit_size / node_size;
    let y = y0 * unit_size / node_size;
    return "(" + x.toFixed(2) + ", " + y.toFixed(2) + ")";
}

function get_matrix() {
    let n_state = objects.reduce((s, i) => starts_with(i.type, "node") ? Math.max(i.id, s) : s, 0);
    let mat = Array(n_state + 1).fill().map(() => Array(n_state + 1).fill(0));
    for (let e of objects) {
        if (starts_with(e.type, "edge")) mat[e.id0][e.id1] = 1;
    }
    return mat;
}

function update_all_names(label = [[""]]) {
    for (let e of objects) {
        if (starts_with(e.type, "edge")) e.name = label[e.id0][e.id1];
    }
    refresh("canvas", [], objects);
}

function update_name() {
    let name = get_str("$new_name");
    let id = get_str("$object_id");
    let types = id.split("_");
    if (starts_with(types[0], "node")) {
        for (let v of objects) {
            if (starts_with(v.type, "node") && v.id == Number(types[1])) v.name = name;
        }
    }
    else if (starts_with(types[0], "edge")) {
        for (let e of objects) {
            if (starts_with(e.type, "edge") && e.id0 == Number(types[1]) && e.id1 == Number(types[2])) e.name = name;
        }
    }
    refresh("canvas", [], objects);
}

window.onload = automata;
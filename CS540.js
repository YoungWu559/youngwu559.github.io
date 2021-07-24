// jshint esversion: 6
// @ts-check

import * as Y from "./YJS.js";

//#region Test Questions
/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_sum_geometric(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let a = Y.rand_int(2, 10);
    let r = Y.round(Y.rand(0.1, 0.9), 1);
    let n = Y.rand_int(20, 40);
    let term = a + "*" + r + "^i";
    if (gen) Y.set_blank(name, ["term", "n"], ["$ " + term, n]);
    else Y.grade_scalar(name, a * ((1 - Math.pow(r, n + 1)) / (1 - r) - 1));
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_plane_normal(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let a = Y.rand_int(2, 5) * Y.rand_sign();
    let b = Y.rand_int(2, 5) * Y.rand_sign();
    let c = Y.rand_int(2, 5) * (-1);
    let d = Y.rand_int(2, 5) * Y.rand_sign();
    let n = Math.sqrt(a * a + b * b + c * c);
    let plane = Y.lin_eq_to_str([a, b, c, d], ["x[1]", "x[2]", "x[3]"]);
    if (gen) Y.set_blank(name, "plane", "$ " + plane);
    else Y.grade_vector(name, [-a / n, -b / n, -c / n]);
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_hessian(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let a = Y.rand_int(-5, 5);
    let b = 2 * Y.rand_int(-5, 5);
    let c = Y.rand_int(-5, 5);
    let expr = Y.lin_eq_to_str([a, b, c], ["x[1]^2", "x[1] x[2]", "x[2]^2"]);
    let x0 = Y.rand_int(-5, 5, 2);
    let point = Y.vec_to_str(x0);
    if (gen) Y.set_blank(name, ["expr", "point"], ["$ " + expr, "$ " + point]);
    else Y.grade_matrix(name, [[2 * a, b], [b, 2 * c]]);
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_derivative(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let a = Y.rand_int(1, 5);
    let b = Y.rand_int(1, 5);
    let expr = "1 / (1 + exp(" + Y.lin_eq_to_str([a, b], ["w"]) + "))";
    if (gen) Y.set_blank(name, "expr", "$ " + expr);
    else Y.grade_expr(name, w => -a * Math.exp(a * w + b) / Math.pow(1 + Math.exp(a * w + b), 2), "w");
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_circle_inside(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let choices = Y.rand_unique_int_vec(1, 20, 5);
    if (gen) {
        let objects1d = [];
        objects1d.push({ type: "rect", x0: -1, y0: 0.1, x1: 1, y1: -0.1, stroke: "red" });
        objects1d.push({ type: "rect", x0: 0.01, y0: 0.05, x1: 1, y1: -0.05, fill: "grey" });
        objects1d.push({ type: "rect", x0: -0.01, y0: 0.05, x1: -1, y1: -0.05, fill: "grey" });
        objects1d.push({ type: "circle", x: 0, y: 0, r: 0.05, fill: "blue" });
        Y.scale_bounding_box_to_canvas(objects1d, "canvas1d_" + name);
        Y.two_paint("canvas1d_" + name, objects1d);
        let objects2d = [];
        objects2d.push({ type: "rect", x0: -2, y0: -2, x1: 2, y1: 2, stroke: "red" });
        objects2d.push({ type: "circle", x: -1, y: -1, r: 1, fill: "grey" });
        objects2d.push({ type: "circle", x: -1, y: 1, r: 1, fill: "grey" });
        objects2d.push({ type: "circle", x: 1, y: -1, r: 1, fill: "grey" });
        objects2d.push({ type: "circle", x: 1, y: 1, r: 1, fill: "grey" });
        objects2d.push({ type: "circle", x: 0, y: 0, r: Math.sqrt(2) - 1, fill: "blue" });
        Y.scale_bounding_box_to_canvas(objects2d, "canvas2d_" + name);
        Y.two_paint("canvas2d_" + name, objects2d);
        let objects3d = [];
        objects3d.push({ type: "sphere", x: -1, y: -1, z: -1, r: 1, fill: "grey" });
        objects3d.push({ type: "sphere", x: -1, y: -1, z: 1, r: 1, fill: "grey" });
        objects3d.push({ type: "sphere", x: -1, y: 1, z: -1, r: 1, fill: "grey" });
        objects3d.push({ type: "sphere", x: -1, y: 1, z: 1, r: 1, fill: "grey" });
        objects3d.push({ type: "sphere", x: 1, y: -1, z: -1, r: 1, fill: "grey" });
        objects3d.push({ type: "sphere", x: 1, y: -1, z: 1, r: 1, fill: "grey" });
        objects3d.push({ type: "sphere", x: 1, y: 1, z: -1, r: 1, fill: "grey" });
        objects3d.push({ type: "sphere", x: 1, y: 1, z: 1, r: 1, fill: "grey" });
        objects3d.push({ type: "cube", x0: -2, y0: -2, z0: -2, x1: 2, y1: 2, z1: 2, stroke: "red" });
        objects3d.push({ type: "sphere", x: 0, y: 0, z: 0, r: Math.sqrt(3) - 1, fill: "blue" });
        Y.scale_bounding_box_to_canvas(objects3d, "canvas3d_" + name, -1, true);
        Y.three_paint("canvas3d_" + name, objects3d);
        Y.set_choices(name, choices);
    }
    else Y.grade_choices(name, choices.map(c => Math.sqrt(c) - 1 > 2));
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_spanning_tree(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let n = 6;
    let dag = Y.rand_digraph(n, 0.5);
    if (gen) {
        let g = Y.mat_to_digraph(dag);
        Y.scale_bounding_box_to_canvas(g, "canvas_" + name);
        Y.two_paint("canvas_" + name, g);
        Y.set_state("select", "canvas_" + name);
    }
    else {
        let selected = Y.get_ans_selected(name);
        Y.set_ans(Y.mat_to_str(Y.get_ans_graph(name, true), 0, "\n", ",", "", "", "", ""), name);
        if (selected.length != n + n - 1) Y.grade_binary(name, 0, -1, "Not spanning.");
        else {
            let covered = Y.zero_vec(n);
            for (let s of selected) {
                if (s.includes("-")) {
                    let ids = s.split("-");
                    covered[Number(ids[1])]++;
                }
            }
            let uncovered = covered.reduce((s, i) => s + (i == 1 ? 0 : 1), 0);
            if (uncovered != 1) Y.grade_binary(name, 0, -1, "Not spanning tree.");
            else Y.grade_binary(name, 1);
        }
    }
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_margin_sum(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let n = 5;
    let g = Y.rand_int(0, 1, n, n);
    let rs = Y.row_sum(g);
    let cs = Y.col_sum(g);
    if (gen) {
        Y.set_blank(name, ["row_sum", "col_sum"], ["$ [" + Y.vec_to_str(rs) + "]", "$ [" + Y.vec_to_str(cs) + "]"]);
        let objects = [{ type: "grid", cts: false, fill: ["white", "black"], stroke: "black", mat: Y.zero_mat(n, n), x0: 0, y0: 0, x1: 1, y1: 1, x_lab: cs, y_lab: rs.reverse(), dx0: 0.05, dy0: 0.05 }];
        Y.scale_bounding_box_to_canvas(objects, "canvas_" + name);
        Y.two_paint("canvas_" + name, objects);
        Y.set_state("select", "canvas_" + name);
    }
    else {
        let ans = Y.get_ans_grid(name);
        let ans_rs = Y.row_sum(ans);
        let ans_cs = Y.col_sum(ans);
        Y.set_ans(Y.mat_to_str(ans, 0, "\n", ",", "", "", "", ""), name);
        let row_ok = Y.vec_equal(rs, ans_rs);
        let col_ok = Y.vec_equal(cs, ans_cs);
        if (row_ok && col_ok) Y.grade_binary(name, 1);
        else if (row_ok) Y.grade_binary(name, 0, -1, "Incorrect column sums.");
        else if (col_ok) Y.grade_binary(name, 0, -1, "Incorrect row sums.");
        else Y.grade_binary(name, 0, -1, "Incorrect column and row sums.");
    }
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_separator(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let n = 20;
    let pts = Y.rand(-1, 1, n, 2);
    let a = Y.rand(-1, 1);
    let y = Y.xor_label(pts, [a, 1, a > 0 ? -1 : 1]);
    let objects = Y.mat_to_points(pts, y);
    Y.scale_bounding_box(objects, Y.to_bound(-1, 1, -1, 1), Y.get_canvas_bounding_box("canvas_" + name));
    let npt = objects.map(o => [o.x, o.y]);
    if (gen) {
        Y.two_paint("canvas_" + name, objects);
        Y.set_state("pen_one_line", "canvas_" + name);
    }
    else {
        let lines = Y.get_canvas_objects("canvas_" + name);
        lines = Y.get_object_by_type(lines, "line");
        if (lines.length == 0) Y.grade_binary(name, 0, -1, "No line.");
        else {
            Y.set_ans(Y.vec_to_str([lines[0].x0, lines[0].y0, lines[0].x1, lines[0].y1], 4, ",", "", ""), name);
            let inc = 0;
            for (let i in npt) {
                let side = Y.side_of_line(npt[i][0], npt[i][1], lines[0].x0, lines[0].y0, lines[0].x1, lines[0].y1);
                if (1 - Math.max(side, 0) != y[i]) inc++;
            }
            if (inc != 0) Y.grade_binary(name, 0, -1, inc + " out of " + n + " points are classified incorrectly.");
            else Y.grade_binary(name, 1);
        }
    }
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_mat_to_digraph(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let n = 4;
    let g = Y.rand_digraph(n);
    if (gen) {
        Y.set_blank(name, "dag", "$ " + Y.mat_to_str(g));
        Y.two_paint("canvas_" + name, []);
        Y.set_state("auto", "canvas_" + name);
    }
    else {
        let ans = Y.get_ans_graph(name);
        Y.set_ans(Y.mat_to_str(ans, 0, "\n", ",", "", "", "", ""), name);
        Y.grade_matrix_as_scalar(name, g);
    }
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_empty(gen = false, name = "", seed = "rand", comment = "") {
    Y.rand_seed(seed);
    if (!gen) {
        let ans = Y.get_ans(name);
        if (ans.trim() == "") Y.grade_binary(name, 0, -1, comment || "Empty.");
        else Y.grade_binary(name, 1);
    }
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_check(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    if (!gen) Y.grade_choices(name, [true]);
}
//#endregion

//#region Percept-ron
/**
 * Spring 2017 Final Q3
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_ltu_update(gen = false, name = "", seed = "rand", n = 3) {
    Y.rand_seed(seed);
    let w = Y.round_vec(Y.rand(-1, 1, n), 1);
    let b = Y.round(Y.rand(-1, 1), 1);
    let x = Y.rand_basis_vec(n);
    let y = Y.rand_int(0, 1);
    let alpha = Y.round(Y.rand(0, 1), 1);
    if (gen) {
        let spans = ["w", "b", "x", "y", "alpha", "wb"];
        let fills = [];
        fills.push("$ " + Y.vec_to_str(w, 1), "$ " + b.toFixed(1));
        fills.push("$ " + Y.vec_to_str(x), "$ " + y);
        fills.push("$ " + alpha.toFixed(1));
        fills.push("$ [[" + Y.sym_vec_to_str("w", n).slice(1, -1) + ", b]]");
        Y.set_blank(name, spans, fills);
    }
    else {
        let new_a = Y.vec_dot([...w, b], [...x, 1]) >= 0 ? 1 : 0;
        let new_w = Y.vec_add([...w, b], [...x, 1], 1, -alpha * (new_a - y));
        Y.grade_vector(name, new_w);
    }
}

/**
 * Fall 2016 Final Q15, Fall 2011 Midterm Q11
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_ltu_update_const(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let d = Y.rand_int(2, 5);
    let x = Y.rand_int(-5, 5);
    let w = Y.rand_int(-5, 5);
    let y = Y.round(Y.rand(0, 1), 2);
    let alpha = 1;
    if (gen) Y.set_blank(name, ["d", "x", "w", "y", "alpha"], [d, x, w, y, alpha]);
    else Y.grade_scalar(name, -alpha * x * (1 / (1 + Math.exp(- d * x * w)) - y));
}

/**
 * Fall 2011 Final Q10, Spring 2018 Final Q4, Fall 2006 Final Q16, Fall 2005 Final Q16
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_percept_and(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let fun = Y.rand_int(0, 1, 4);
    fun[3] = fun[2];
    if (gen) Y.set_blank(name, ["00", "01", "10", "11"], fun);
    else {
        let ans = Y.get_ans_vec(name);
        if (ans.length < 3) Y.grade_vector(name, [1, 1, 1]);
        else {
            let t = (Y.ltu(ans[0] + ans[1] * 0 + ans[2] * 0) == fun[0]);
            t = t && (Y.ltu(ans[0] + ans[1] * 0 + ans[2] * 1) == fun[1]);
            t = t && (Y.ltu(ans[0] + ans[1] * 1 + ans[2] * 0) == fun[2]);
            t = t && (Y.ltu(ans[0] + ans[1] * 1 + ans[2] * 1) == fun[3]);
            if (t) Y.grade_binary(name, 1);
            else Y.grade_binary(name, [0, 3]);
        }
    }
}

/**
 * Fall 2009 Final Q17, Fall 2009 Final Q19, Fall 2008 Final Q3
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_lin_sep(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let y = Y.rand_int(0, 1, 8);
    if (gen) {
        Y.set_blank(name, Y.str_seq(0, 7, 1, "y"), y);
        let x = Y.cube_corner(3);
        let objects = [];
        objects.push({ type: "camera", x: 2.5, y: 2, z: 2 });
        objects.push(...Y.mat_to_points(x, y, "p", [], [], [], 0.25));
        Y.three_paint("canvas_" + name, objects);
    }
    else Y.grade_binary(name, 1);
}
//#endregion

//#region Logistic Regression
/**
 * Fall 2017 Final Q23
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_rlu_inverse(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let w0 = Y.rand_int_not(-10, 10, 0);
    let w1 = Y.rand_int_not(-10, 10, 0);
    let f = "$ max(0, " + Y.lin_eq_to_str([w1, w0], ["x"]) + ")";
    let bound = w1 > 0 ? "largest" : "smallest";
    let y = 0;
    if (gen) Y.set_blank(name, ["f", "w", "b", "bound", "y"], [f, w1, w0, bound, y]);
    else Y.grade_scalar(name, -w0 / w1);
}

/**
 * Fall 2012 Final Q8, Fall 2014 Midterm Q16
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_sigmoid_inverse(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let w0 = Y.rand_int_not(-10, 10, 0);
    let w1 = Y.rand_int_not(-10, 10, 0);
    let y = Y.round(Y.rand(0.1, 0.9), 2);
    if (gen) Y.set_blank(name, ["w0", "w1", "y"], [w0, w1, y]);
    else Y.grade_scalar(name, (-Math.log(1 / y - 1) - w0) / w1);
}

/**
 * Fall 2017 Final Q23
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_sigmoid_tanh(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let list = [];
    list.push({ h: "$ (e^x - e^(-x)) / (e^x + e^(-x))", g: x => (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x)) });
    list.push({ h: "$ e^(x) / (1 + e^(x))", g: x => (Math.exp(x) / (1 + Math.exp(x))) });
    let fun = Y.rand_elem(list);
    if (gen) Y.set_blank(name, "h", fun.h);
    else {
        let abc = Y.get_ans_vec(name);
        if (abc.length < 3) Y.grade_vector(name, [-1, -1, -1]);
        else {
            let func = x => abc[0] * Y.log_it(abc[1] * x) + abc[2];
            if (Y.func_equal(func, fun.g)) Y.grade_vector(name, abc);
            else Y.grade_scalar(name, -1);
        }
    }
}
//#endregion

//#region Gradient Descent Optimization
/**
 * Fall 2017 Final Q7, Fall 2014 Midterm Q17, Fall 2013 Final Q10
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_step_size(gen = false, name = "", seed = "rand", nc = 5) {
    Y.rand_seed(seed);
    let list = [];
    list.push({ h: "$ x^2", f: x => x * x, df: x => 2 * x });
    list.push({ h: "$ 2 x^2", f: x => 2 * x * x, df: x => 4 * x });
    list.push({ h: "$ 1/2 x^2", f: x => 1 / 2 * x * x, df: x => x });
    list.push({ h: "$ x^4", f: x => x * x * x * x, df: x => 4 * x * x * x });
    list.push({ h: "$ 1/2 x^4", f: x => 1 / 2 * x * x * x * x, df: x => 2 * x * x * x });
    list.push({ h: "$ 1/4 x^4", f: x => 1 / 4 * x * x * x * x, df: x => x * x * x });
    let fun = Y.rand_elem(list);
    let x = Y.rand_int(2, 10);
    let cut = x / fun.df(x) * 4;
    let choices = Y.rand_unique_vec(0, cut, nc);
    if (gen) {
        Y.set_blank(name, ["f", "x"], [fun.h, x]);
        Y.set_choices(name, choices.map(c => c.toFixed(4)));
    }
    else Y.grade_choices(name, choices.map(e => Math.abs(x - e * fun.df(x)) < Math.abs(x)));
}

/**
 * Fall 2017 Final Q15, Fall 2010 Final Q5, Fall 2006 Midterm Q11, Fall 2005 Midterm Q5
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_grad_descent(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let list = [];
    list.push({ h: "$ x[1] + 2 x[2] + 3 x[3]", f: x => x[0] + 2 * x[1] + 3 * x[2], df: x => [1, 2, 3], d: 3 });
    list.push({ h: "$ x[1] + 2 x[2]^2 + 3 x[3]^3", f: x => x[0] + 2 * x[1] * x[1] + 3 * x[2] * x[2] * x[2], df: x => [1, 4 * x[1], 9 * x[2] * x[2]], d: 3 });
    list.push({ h: "$ x[1]^2 + 2 x[2]^2 + 3 x[3]^2", f: x => x[0] * x[0] + 2 * x[1] * x[1] + 3 * x[2] * x[2], df: x => [2 * x[0], 4 * x[1], 6 * x[2]], d: 3 });
    list.push({ h: "$ x[1] + x[2]^2 + x[3]^3", f: x => x[0] + x[1] * x[1] + x[2] * x[2] * x[2], df: x => [1, 2 * x[1], 3 * x[2] * x[2]], d: 3 });
    let fun = Y.rand_elem(list);
    let x = Y.rand_int(0, 5, fun.d);
    let e = Y.round(Y.rand(0.1, 1), 2);
    if (gen) Y.set_blank(name, ["f", "x", "eta"], [fun.h, Y.vec_to_str(x, 0), e]);
    else Y.grade_vector(name, Y.vec_add(x, fun.df(x), 1, -e));
}

/**
 * Fall 2017 Final Q2
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_med_opt(gen = false, name = "", seed = "rand", nc = 3) {
    Y.rand_seed(seed);
    let x = Y.rand_unique_int_vec(1, 10, nc);
    if (gen) Y.set_blank(name, Y.str_seq(1, nc, 1, "x"), x);
    else Y.grade_scalar(name, Y.median(x));
}

/**
 * Fall 2014 Final Q4, Fall 2005 Midterm Q6
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_convex(gen = false, name = "", seed = "rand", nc = 5) {
    Y.rand_seed(seed);
    let list = [];
    list.push({ h: "$ -x^2", g: x => -2 });
    list.push({ h: "$ -x+2", g: x => 0 });
    list.push({ h: "$ x^3", g: x => 6 * x });
    list.push({ h: "$ log(x^2)", g: x => - 2 / (x * x) });
    list.push({ h: "$ exp(-x)", g: x => Math.exp(-x) });
    list.push({ h: "$ (x - 1)^4", g: x => 12 * Math.pow(x - 1, 2) });
    list.push({ h: "$ (x - 1)^2 + (x + 1)^2", g: x => 4 });
    list.push({ h: "$ -1", g: x => 0 });
    list.push({ h: "$ -exp(-x)", g: x => -Math.exp(-x) });
    list.push({ h: "$ x^2 + x^3", g: x => 1 + 6 * x });
    let choices = Y.rand_subset(list, nc);
    if (gen) Y.set_choices(name, choices.map(c => c.h));
    else Y.grade_choices(name, choices.map(c => Y.always_positive(c.g)));
}

/**
 * Fall 2017 Final Q21
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_flip_accuracy(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let acc = Y.round(Y.rand(0, 1), 2);
    if (gen) Y.set_blank(name, "acc", acc);
    else Y.grade_scalar(name, 1 - acc);
}

/**
 * Fall 2014 Final Q4, Fall 2010 Final Q1
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_test_accuracy(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let list = [];
    list.push({ h: "$ (-1)^i", g: i => Math.pow((-1), i) });
    list.push({ h: "$ sin(pi * i + pi / 2)", g: i => Math.sin(Math.PI * i + Math.PI / 2) });
    list.push({ h: "$ cos(pi * i)", g: i => Math.cos(Math.PI * i) });
    let fun = Y.rand_elem(list);
    let p = Y.rand_sign();
    if (gen) Y.set_blank(name, ["y", "p"], [fun.h, p]);
    else {
        let acc = 0;
        for (let i = 0; i < 100; i++) acc += (fun.g(i) == p ? 1 : 0);
        Y.grade_scalar(name, acc / 100);
    }
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_zero_one_cost(gen = false, name = "", seed = "rand", n = 6) {
    Y.rand_seed(seed);
    let y = Y.rand_int(0, 1, n);
    if (gen) Y.set_blank(name, Y.str_seq(1, n, 1, "y"), y);
    else {
        let c = y.map((_, i) => Y.classify_threshold(y, i));
        Y.grade_scalar(name, y.length - Math.max(...c));
    }
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_equal_loss(gen = false, name = "", seed = "rand", nc = 5) {
    Y.rand_seed(seed);
    let list = [];
    list.push({ l: "$ f(x[i]) != y[i]", f: (x, y) => (x != y ? 1 : 0) });
    list.push({ l: "$ f(x[i]) == y[i]", f: (x, y) => (x == y ? 1 : 0) });
    list.push({ l: "$ abs(f(x[i]) - y[i])", f: (x, y) => Math.abs(x - y) });
    list.push({ l: "$ max(0, 1 - f(x[i]) y[i])", f: (x, y) => Math.max(0, 1 - x * y) });
    list.push({ l: "$ max(0, 1 - (2 f(x[i]) - 1)(2 y[i] - 1))", f: (x, y) => Math.max(0, 1 - (2 * x - 1) * (2 * y - 1)) });
    let choices = Y.rand_subset(list, nc);
    if (gen) Y.set_choices(name, choices.map(c => c.l));
    else Y.grade_choices(name, choices.map(c => c.f(0, 0) == 0 && c.f(0, 1) == 1 && c.f(1, 0) == 1 && c.f(1, 1) == 1));
}

/**
 * Fall 2014 Midterm Q3
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_local_opt(gen = false, name = "", seed = "rand", nc = 5) {
    Y.rand_seed(seed);
    let sign = Y.rand_elem(["<", "=", ">"]);
    let x = Y.rand_int(-5, 5);
    let choices = Y.rand_unique_int_vec(x - 5, x + 5, nc);
    choices[Y.rand_int(0, choices.length - 1)] = x;
    if (gen) {
        Y.set_blank(name, ["sign", "x", "xp"], [sign, x, x]);
        Y.set_choices(name, choices);
    }
    else {
        if (sign == "<") Y.grade_choices(name, choices.map(c => c > x));
        else if (sign == "=") Y.grade_choices(name, choices.map(c => c = x));
        else if (sign == ">") Y.grade_choices(name, choices.map(c => c < x));
    }
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_var_reduce(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let e = Y.rand_int(-10, 10, 2);
    let v = Y.rand_int(2, 10, 2);
    if (gen) {
        Y.set_blank(name, ["ex", "ey"], e);
        Y.set_blank(name, ["vx", "vy"], v);
    }
    else {
        let cov = Y.get_num(Y.get_ans(name), 0);
        if (cov >= v[1] / 2 && cov <= Math.sqrt(v[0] * v[1])) Y.grade_binary(name, 1);
        else Y.grade_binary(name, 0);
    }
}
//#endregion

//#region Neural Network
/**
 * Fall 2017 Final Q19, Spring 2017 Final Q4
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_linear_nn(gen = false, name = "", seed = "rand", nc = 5) {
    Y.rand_seed(seed);
    let list = [];
    let a = Y.rand_int(1, 9);
    let b = Y.rand_int(1, 9);
    let c = Y.rand_int(1, 9);
    list.push({ h: "$ " + Y.lin_eq_to_str([a], [""]), dh: x => 0 });
    list.push({ h: "$ " + Y.lin_eq_to_str([b], [""]), dh: x => 0 });
    list.push({ h: "$ " + Y.lin_eq_to_str([a, b], ["", "x"]), dh: x => b });
    list.push({ h: "$ " + Y.lin_eq_to_str([b, c], ["", "x"]), dh: x => c });
    list.push({ h: "$ " + Y.lin_eq_to_str([a, b, c], ["", "x", "x^2"]), dh: x => c * x });
    list.push({ h: "$ 1 / (1 + exp(-" + a + " * x))", dh: x => (1 - 1 / (1 + Math.exp(- a * x))) * 1 / (1 + Math.exp(a * x)) });
    list.push({ h: "$ max(0, x)", dh: x => (x > 0) ? 1 : 0 });
    list.push({ h: "$ min(0, x)", dh: x => (x > 0) ? 1 : 0 });
    let choices = Y.rand_subset(list, nc);
    if (gen) Y.set_choices(name, choices.map(c => c.h));
    else Y.grade_choices(name, choices.map(c => Y.always_constant(c.dh)));
}

/**
 * Fall 2013 Final Q8, Fall 2019 Final Q14, Fall 2006 Final Q17, Fall 2005 Final Q17
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_count_weight_nn(gen = false, name = "", seed = "rand", layer = 3, w = true, b = true) {
    Y.rand_seed(seed);
    let units = Y.rand_int(1, 20, layer + 1);
    let names = Y.seq(0, layer, 1).map(i => "u" + i.toFixed(0));
    if (gen) Y.set_blank(name, names, units);
    else {
        let ans = 0;
        for (let i = 1; i <= layer; i++) {
            if (w) ans += units[i] * units[i - 1];
            if (b) ans += units[i];
        }
        Y.grade_scalar(name, ans);
    }
}

/**
 * Fall 2010 Final Q17
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_fun_to_weights(gen = false, name = "", seed = "rand", layers = [2, 2, 1], missing = [0, 0, 0]) {
    Y.rand_seed(seed + missing[0] + missing[1] + missing[2]);
    let weights = [];
    for (let i = 1; i < layers.length; i++) {
        weights.push(Y.round_mat(Y.rand(-1, 1, layers[i - 1] + 1, layers[i]), 2));
        for (let j = 0; j < layers[i]; j++) weights[i - 1][layers[i - 1]][j] = Y.round(- 0.5 * (weights[i - 1][layers[i - 1] - 1][j] + weights[i - 1][0][j]), 2);
    }
    let ltu_nn = (x, w) => Y.classify_nn(x, { w: w }, Y.ltu);
    let train = [[0, 0], [0, 1], [1, 0], [1, 1]];
    let output = Y.classify_vec(train, weights, ltu_nn);
    if (gen) {
        Y.set_blank(name, ["00", "01", "10", "11"], output);
        let edges = weights.map(l => l.map(k => k.map(u => u.toFixed(2))));
        edges[missing[0]][missing[1]][missing[2]] = "w";
        for (let i = 1; i < layers.length; i++) {
            let u = edges[i - 1].length;
            Y.set_blank(name, "w" + i, "$ " + Y.mat_to_str(edges[i - 1].slice(0, u - 1)));
            Y.set_blank(name, "b" + i, "$ " + Y.mat_to_str(edges[i - 1].slice(u - 1, u)));
        }
        edges[missing[0]][missing[1]][missing[2]] = "???";
        let net = Y.weights_to_nn(edges);
        Y.scale_bounding_box_to_canvas(net, "canvas_" + name);
        Y.set_state("move", "canvas_" + name);
        Y.two_paint("canvas_" + name, net);
    }
    else {
        let text = Y.get_ans(name);
        if (text.trim() == "") Y.grade_binary(name, 0, -1, "Empty.");
        else {
            let ans = Y.get_num(text);
            weights[missing[0]][missing[1]][missing[2]] = ans;
            let new_out = Y.classify_vec(train, weights, ltu_nn);
            if (Y.vec_equal(output, new_out)) Y.grade_binary(name, 1);
            else Y.grade_binary(name, 0);
        }
    }
}

/**
 * Fall 2010 Final Q19
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_rand_coin(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let p = Y.round(Y.rand(0.5, 1), 2);
    let r = Y.round(Y.rand(0.5, 1), 2);
    if (gen) Y.set_blank(name, ["p", "r"], [p, r]);
    else Y.grade_scalar(name, p * r + (1 - p) * (1 - r));
}

/**
 * Fall 2011 Midterm Q12
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_one_hot(gen = false, name = "", seed = "rand", n = 3) {
    Y.rand_seed(seed);
    let out = Y.rand(0.1, 0.9, n);
    let i = Y.arg_max(out);
    out[i] += 0.01;
    let sum = Y.vec_sum(out);
    out = Y.round_vec(Y.vec_mul(out, 1 / sum), 2);
    if (gen) Y.set_blank(name, "out", "$ " + Y.vec_to_str(out));
    else Y.grade_scalar(name, i);
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_activate_ltu_nn(gen = false, name = "", seed = "rand", layers = [2, 2, 1]) {
    Y.rand_seed(seed);
    let weights = [];
    for (let i = 1; i < layers.length; i++) {
        weights.push(Y.round_mat(Y.rand(-1, 1, layers[i - 1] + 1, layers[i]), 2));
        for (let j = 0; j < layers[i]; j++) weights[i - 1][layers[i - 1]][j] = Y.round(- 0.5 * (weights[i - 1][layers[i - 1] - 1][j] + weights[i - 1][0][j]), 2);
    }
    if (gen) {
        for (let i = 1; i < layers.length; i++) {
            let u = weights[i - 1].length;
            Y.set_blank(name, "w" + i, "$ " + Y.mat_to_str(weights[i - 1].slice(0, u - 1)));
            Y.set_blank(name, "b" + i, "$ " + Y.mat_to_str(weights[i - 1].slice(u - 1, u)));
        }
        let edges = weights.map(l => l.map(k => k.map(u => u.toFixed(2))));
        let net = Y.weights_to_nn(edges);
        Y.scale_bounding_box_to_canvas(net, "canvas_" + name);
        Y.set_state("move", "canvas_" + name);
        Y.two_paint("canvas_" + name, net);
    }
    if (gen) Y.set_blank(name, [], []);
    else {
        let ltu_nn = (x, w) => Y.classify_nn(x, { w: w }, Y.ltu);
        let train = [[0, 0], [0, 1], [1, 0], [1, 1]];
        let output = Y.classify_vec(train, weights, ltu_nn);
        Y.grade_vector_as_scalar(name, output);
    }
}
//#endregion

//#region Support Vector Machine
/**
 * Fall 2014 Midterm Q12, Fall 2013 Final Q4, Spring 2017 Final Q2
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_svm_pred(gen = false, name = "", seed = "rand", nc = 5, nd = 5) {
    Y.rand_seed(seed);
    let w = Y.rand_int(-1, 1, nd);
    let b = Y.rand_int(-5, 5);
    let choices = Y.rand_int(-5, 5, nc, nd);
    if (gen) {
        Y.set_blank(name, ["w", "b"], ["$ " + Y.vec_to_str(w), "$ " + b]);
        Y.set_choices(name, choices.map(c => "$ " + Y.vec_to_str(c)));
    }
    else Y.grade_choices(name, choices.map(x => Y.vec_dot(w, x) + b >= 0));
}

/**
 * Fall 2014 Midterm Q14
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_svm_margin(gen = false, name = "", seed = "rand", nd = 3) {
    Y.rand_seed(seed);
    let w = Y.rand_int(-5, 5, nd);
    let b = Y.rand_int(-5, 5);
    if (gen) Y.set_blank(name, ["w", "b"], ["$ " + Y.vec_to_str(w), "$ " + b]);
    else Y.grade_scalar(name, 2 / Math.sqrt(Y.vec_dot(w, w)));
}

/**
 * Fall 2014 Midterm Q15, Fall 2013 Final Q7, Fall 2011 Midterm 9
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_svm_kernel_sum(gen = false, name = "", seed = "rand", np = 2, nt = 2) {
    Y.rand_seed(seed);
    let phi = Y.rand_int(-5, 5, np);
    let theta = Y.rand_int(-5, 5, nt);
    let a = Y.rand_int(1, 5);
    let b = Y.rand_int(1, 5);
    if (gen) Y.set_blank(name, ["phi", "theta", "a", "b"], ["$ " + Y.vec_to_str(phi), "$ " + Y.vec_to_str(theta), a, b]);
    else Y.grade_vector(name, Y.round_vec([...Y.vec_mul(phi, Math.sqrt(a)), ...Y.vec_mul(theta, Math.sqrt(b))], 2));
}

/**
 * Fall 2014 Midterm Q13, Fall 2012 Final Q7
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_svm_slack_zero(gen = false, name = "", seed = "rand", n = 3) {
    Y.rand_seed(seed);
    let corners = Y.cube_corner(n);
    let two = Y.rand_subset(corners, 2);
    if (gen) Y.set_blank(name, ["x1", "x2"], ["$ " + Y.vec_to_str(two[0]), "$ " + Y.vec_to_str(two[1])]);
    else Y.grade_vector(name, Y.rep(0, n));
}

/**
 * Fall 2010 Final Q14, Fall 2019 Final Q6
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_vc_dim(gen = false, name = "", seed = "rand", nc = 5) {
    Y.rand_seed(seed);
    let n = Y.rand_int(2, 3);
    let choices = Y.rand_unique_int_vec(1, 6, nc);
    if (gen) {
        Y.set_blank(name, "n", n);
        Y.set_choices(name, choices);
    }
    else Y.grade_choices(name, choices.map(c => c <= n + 1));
}

/**
 * Fall 2011 Midterm Q7
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_dist_line_origin(gen = false, name = "", seed = "rand", nd = 3) {
    Y.rand_seed(seed);
    let w = Y.rand_int(1, 3, nd);
    let c = Y.round(Y.rand(1, 5), 2);
    if (gen) Y.set_blank(name, ["c", "w"], ["$ " + c, "$ " + Y.vec_to_str(w)]);
    else Y.grade_scalar(name, c / Math.sqrt(Y.vec_dot(w, w)));
}

/**
 * Fall 2011 Midterm Q8, Fall 2009 Final Q1
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_slack_value(gen = false, name = "", seed = "rand", nd = 3) {
    Y.rand_seed(seed);
    let w = Y.rand_int(-3, 3, nd);
    let x = Y.rand_int(-5, 5, nd);
    let y = Y.rand_int(0, 1);
    let b = Y.rand_int(2, 5) * (y <= 0 ? 1 : -1) - Y.vec_dot(w, x);
    if (gen) Y.set_blank(name, ["w", "b", "x", "y"], ["$ " + Y.vec_to_str(w), "$ " + b, "$ " + Y.vec_to_str(x), "$ " + y]);
    else Y.grade_scalar(name, Math.max(0, 1 - (Y.vec_dot(w, x) + b) * (y <= 0 ? -1 : 1)));
}

/**
 * Fall 2019 Final Q11, Fall 2006 Final Q15, Fall 2005 Final Q15
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_svm_weights(gen = false, name = "", seed = "rand", plot = true) {
    Y.rand_seed(seed);
    let x = Y.rand_int(-5, 5, 4);
    let x1 = [Math.min(x[0], x[1]), Math.max(x[0], x[1]) + 1];
    let x2 = [Math.max(x[2], x[3]) + 1, Math.min(x[2], x[3])];
    if (x1[0] == x2[0]) x2[0] += Y.rand_dist([0.5, 0.5], [-1, 1]);
    if (x1[1] == x2[1]) x2[1] += Y.rand_dist([0.5, 0.5], [-1, 1]);
    let y1 = Y.rand_int(0, 1);
    let y2 = 1 - y1;
    let scale = Y.rand_int(1, 5) * 2;
    let mid = Y.vec_add(x1, x2, 1 / 2, 1 / 2);
    let b = 0;
    if (y2 == 1) b = Y.round(- scale * ((x2[0] - x1[0]) * mid[0] + (x2[1] - x1[1]) * mid[1]), 2);
    else b = Y.round(- scale * ((x1[0] - x2[0]) * mid[0] + (x1[1] - x2[1]) * mid[1]), 2);
    if (gen) {
        Y.set_blank(name, ["x1", "y1", "x2", "y2", "b"], ["$ " + Y.vec_to_str(x1), "$ " + y1, "$ " + Y.vec_to_str(x2), "$ " + y2, b]);
        if (plot) {
            let objects = [];
            objects.push({ type: "grid", x0: -6, x1: 6, y0: -6, y1: 6, c0: "lightgray", mat: Y.zero_mat(12, 12) });
            objects.push({ type: "axis", x0: -6, x1: 6, y0: 0, y1: 0 });
            objects.push({ type: "axis", x0: 0, x1: 0, y0: -6, y1: 6 });
            objects.push({ type: "circle", x: x1[0], y: x1[1], r: 0.5, c1: "red" });
            objects.push({ type: "circle", x: x2[0], y: x2[1], r: 0.5, c1: "blue" });
            Y.set_object_by_value(objects, "", 0, "hard", true);
            Y.scale_bounding_box_to_canvas(objects, "canvas_" + name);
            Y.set_state("pen_line", "canvas_" + name);
            Y.two_paint("canvas_" + name, objects);
        }
    }
    else {
        let w = Y.get_ans_vec(name);
        if (w.length < 2) Y.grade_binary(name);
        else {
            let close = ((2 * y1 - 1) * (x1[0] * w[0] + x1[1] * w[1] + b) >= 0) && ((2 * y2 - 1) * (x2[0] * w[0] + x2[1] * w[1] + b) >= 0);
            if (close) close = close && (mid[0] * w[0] + mid[1] * w[1] + b == 0);
            if (close) close = close && w[0] != 0 && w[1] != 0;
            if (close) close = close && Math.abs((x2[1] - x1[1]) / (x2[0] - x1[0])) == Math.abs(w[1] / w[0]);
            if (close) Y.grade_vector(name, w);
            else Y.grade_binary(name);
        }
    }
}

/**
 * Fall 2019 Final Q7, Fall 2019 Final Q8
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_remove_svm(gen = false, name = "", seed = "rand", max = true, support = true) {
    Y.rand_seed(seed);
    let n = Y.rand_int(5, 10, 2);
    if (gen) Y.set_blank(name, ["np", "nn"], n);
    else Y.grade_scalar(name, support ? Y.vec_sum(n) + 1 : (max ? Y.vec_sum(n) - 2 : 1));
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_hinge_gradient(gen = false, name = "", seed = "rand", cost = "hinge") {
    Y.rand_seed(seed);
    let c = "";
    if (cost == "hinge") c = "$ max(0, 1 - a[i] * y[i])";
    else if (cost == "ce") c = "$ -y[i] * log(a[i]) - (1 - y[i]) * log(1 - a[i])";
    let wb = Y.rand_int(-5, 5, 2);
    let x = Y.rand_int(-5, 5);
    let y = Y.rand_int(0, 1);
    let alpha = Y.rand_int(2, 4);
    if (gen) Y.set_blank(name, ["cost", "x", "y", "wb", "alpha"], [c, x, y, "$ " + Y.vec_to_str(wb), alpha]);
    else {
        let a = Y.vec_dot(wb, [x, 1]);
        if (cost == "hinge") Y.grade_vector(name, Y.vec_add(wb, Y.vec_mul([x, 1], 1 - a * y > 0 ? - y : 0), 1, -alpha));
        else if (cost == "ce") Y.grade_vector(name, Y.vec_add(wb, Y.vec_mul([x, 1], - y / a + (1 - y) / (1 - a)), 1, -alpha));
    }
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_feature_to_kernel(gen = false, name = "", seed = "rand", n = 3) {
    Y.rand_seed(seed);
    let x = Y.rand_int(-10, 10, 2);
    let p = [{ f: x => 1, g: "1" },
    { f: x => x, g: "x" },
    { f: x => x * x, g: "x^2" },
    { f: x => x * x * x, g: "x^3" },
    { f: x => Math.exp(x), g: "exp(x)" }];
    let phi = Y.rand_elem(p, n);
    if (gen) {
        Y.set_blank(name, ["x1", "x2"], x);
        Y.set_blank(name, "phi", "$ " + Y.vec_to_str(phi.map(p => p.g)));
    }
    else {
        let x0 = phi.map(i => i.f(x[0]));
        let x1 = phi.map(i => i.f(x[1]));
        Y.grade_matrix(name, [[Y.vec_dot(x0, x0), Y.vec_dot(x0, x1)], [Y.vec_dot(x1, x0), Y.vec_dot(x1, x1)]]);
    }
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_one_vs_one(gen = false, name = "", seed = "rand", n = 5) {
    Y.rand_seed(seed);
    let cab = Y.rand_unique_int_vec(0, n - 1, 2);
    let c = Y.rand_int(1, 100, n);
    if (gen) {
        Y.set_blank(name, ["ca", "cb"], cab);
        Y.set_blank(name, Y.str_seq(0, n - 1, 1, "c"), c);
    }
    else Y.grade_scalar(name, c[cab[0]] + c[cab[1]]);
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_sub_grad(gen = false, name = "", seed = "rand", nc = 5) {
    Y.rand_seed(seed);
    let a = Y.rand_int(2, 10) * Y.rand_sign();
    if (gen) Y.set_blank(name, "fun", "$ max(0, " + a + " x)");
    else Y.grade_vector(name, (a > 0 ? [0, a] : [a, 0]), -1, "", false, -1, true);
}

/**
 * Fall 2014 Final Q17
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_svm_transform(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let b = Y.rand_int(-5, 5, 2);
    if (gen) Y.set_blank(name, "b", "$ " + Y.vec_to_str(b));
    else {
        let mat = Y.str_to_mat_line(Y.get_ans(name));
        if (mat.length == 2 && mat[0].length == 2 && mat[1].length == 2) {
            let det = mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0];
            if (det == 0) Y.grade_binary(name, 1);
            else Y.grade_binary(name, 0);
        }
        else Y.grade_binary(name, [0, 2, 2]);
    }
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_svm_full_support(gen = false, name = "", seed = "rand", n = 3, y = true) {
    Y.rand_seed(seed);
    let t = Y.rand_int(-5, 5);
    let max = Y.rand_int(1, 5);
    let min = Y.rand_int(-5, -1);
    let left = Y.rand_unique_int_vec(-10, t - 1, n);
    let right = Y.rand_unique_int_vec(t + 1, 10, n);
    let y0 = Y.rand_int(0, 1);
    if (gen) {
        let same = y ? "1" : "2";
        let diff = y ? "2" : "1";
        for (let i = 0; i < n; i++) {
            Y.set_blank(name, "x" + same + (i + 1), max);
            Y.set_blank(name, "x" + same + (n + i + 1), min);
            Y.set_blank(name, "x" + diff + (i + 1), left[i]);
            Y.set_blank(name, "x" + diff + (n + i + 1), right[i]);
        }
        Y.set_blank(name, "y", y0);
    }
    else {
        let vec = Y.get_ans_vec(name);
        if (vec.length == 2) {
            let cd = (y ? 0 : 1);
            let same = (y0 == 1 && vec[cd] == min && vec[1 - cd] < t);
            same = same || (y0 == 0 && vec[cd] == max && vec[1 - cd] > t);
            if (same) Y.grade_binary(name, 1);
            else Y.grade_binary(name, 0);
        }
        else Y.grade_binary(name, [0, 2]);
    }
}
//#endregion

//#region KNN Nearest Neighbor
/**
 * Fall 2014 Midterm Q6
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_manhattan_dist(gen = false, name = "", seed = "rand", nd = 4) {
    Y.rand_seed(seed);
    let x1 = Y.rand_int(-8, 8, nd);
    let x2 = Y.rand_int(-8, 8, nd);
    if (gen) Y.set_blank(name, ["x1", "x2"], ["$ " + Y.vec_to_str(x1), "$ " + Y.vec_to_str(x2)]);
    else Y.grade_scalar(name, Y.dist(x1, x2, 1));
}

/**
 * Fall 2013 Final Q5, Fall 2011 Midterm Q3 
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_knn_grid(gen = false, name = "", seed = "rand", nc = 4) {
    Y.rand_seed(seed);
    let a = Y.rand_int(1, 4);
    let b = Y.rand_int(1, 4);
    let choices = Y.round_mat(Y.rand(1, 9, nc, 2), 2);
    if (gen) {
        let objects = [];
        objects.push({ type: "grid", x0: 0, x1: 10, y0: 0, y1: 10, c0: "lightgray", mat: Y.zero_mat(10, 10) });
        objects.push({ type: "axis", x0: 0, x1: 10, y0: 0, y1: 0 });
        objects.push({ type: "axis", x0: 0, x1: 0, y0: 0, y1: 10 });
        for (let i = 0; a * i <= 10; i++) {
            for (let j = 0; b * j <= 10; j++) {
                objects.push({ type: "circle", x: a * i, y: b * j, r: 0.25, c1: (a * i > b * j ? "red" : "blue") });
            }
        }
        for (let k = 0; k < nc; k++) {
            objects.push({ type: "point", x: choices[k][0], y: choices[k][1], r: 0.125, c1: "black" });
            objects.push({ type: "point", shape: String(k + 1), x: choices[k][0] + 0.25, y: choices[k][1] + 0.25, r: 0.25 });
        }
        Y.set_object_by_value(objects, "", 0, "hard", true);
        Y.scale_bounding_box_to_canvas(objects, "canvas_" + name);
        Y.set_state("pen_line", "canvas_" + name);
        Y.two_paint("canvas_" + name, objects);
        Y.set_blank(name, "pts", "$ " + Y.vec_to_str([a + " a", b + " b"]));
        Y.set_choices(name, choices.map(c => "$ " + Y.vec_to_str(c)));
    }
    else Y.grade_choices(name, choices.map(c => Y.round(c[0] / a, 0) * a > Y.round(c[1] / b, 0) * b));
}

/**
 * Midterm 2014 Midterm Q2, Fall 2012 Final Q4
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_knn_class(gen = false, name = "", seed = "rand", nc = 5) {
    Y.rand_seed(seed);
    let y = Y.rand_int(0, 1, 4);
    y[3] = 1 - y[0];
    let choices = Y.rand_int(-3, 3, nc, 2);
    if (gen) {
        Y.set_blank(name, ["00", "01", "10", "11"], y);
        Y.set_choices(name, choices.map(c => "$ " + Y.vec_to_str(c)));
        let objects = [];
        objects.push({ type: "grid", x0: -3, x1: 3, y0: -3, y1: 3, c0: "lightgray", mat: Y.zero_mat(6, 6) });
        objects.push({ type: "axis", x0: -3, x1: 3, y0: 0, y1: 0 });
        objects.push({ type: "axis", x0: 0, x1: 0, y0: -3, y1: 3 });
        objects.push({ type: "circle", x: -1, y: -1, r: 0.25, c1: (y[0] ? "red" : "blue") });
        objects.push({ type: "circle", x: -1, y: 1, r: 0.25, c1: (y[1] ? "red" : "blue") });
        objects.push({ type: "circle", x: 1, y: -1, r: 0.25, c1: (y[2] ? "red" : "blue") });
        objects.push({ type: "circle", x: 1, y: 1, r: 0.25, c1: (y[3] ? "red" : "blue") });
        for (let k = 0; k < nc; k++) {
            objects.push({ type: "point", x: choices[k][0], y: choices[k][1], r: 0.125, c1: "black" });
            objects.push({ type: "point", shape: String(k + 1), x: choices[k][0] + 0.25, y: choices[k][1] + 0.25, r: 0.25 });
        }
        Y.set_object_by_value(objects, "", 0, "hard", true);
        Y.scale_bounding_box_to_canvas(objects, "canvas_" + name);
        Y.set_state("pen_line", "canvas_" + name);
        Y.two_paint("canvas_" + name, objects);
    }
    else {
        let weights = Y.train_knn([[-1, -1], [-1, 1], [1, -1], [1, 1]], y, 1);
        Y.grade_choices(name, choices.map(c => Y.classify_knn(c, weights) == 1));
    }
}

/**
 * Fall 2011 Final Q20
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_loo_knn(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let nn = Y.rand_int(2, 50);
    let np = Y.rand_int(2, 50);
    if (nn % 2 != np % 2) np++;
    let k = nn + np - 1;
    if (gen) Y.set_blank(name, ["np", "nn", "k"], [nn, np, k]);
    else Y.grade_scalar(name, nn == np ? 0 : Math.abs(nn - np) == 1 ? 0.5 : Y.round(Math.max(nn, np) / (nn + np), 2));
}

/**
 * Spring 2017 Midterm Q6
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_knn_decision(gen = false, name = "", seed = "rand", n = 5, last = Math.floor(n / 2)) {
    Y.rand_seed(seed);
    let x = Y.round_vec(Y.rand(-10, 10, n), 2).sort((a, b) => a - b);
    if (gen) Y.set_blank(name, Y.str_seq(1, n, 1, "x"), x);
    else Y.grade_scalar(name, 0.5 * (x[last + 1] + x[last - 2]));
}

/**
 * Spring 2017 Midterm Q7, Fall 2014 Final Q19
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_knn_training_set(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let nn = Y.rand_int(1, 50);
    let np = Y.rand_int(1, 50);
    let k = Y.rand_elem([1, np + nn]);
    if (gen) Y.set_blank(name, ["nn", "np", "k"], [nn, np, k]);
    else Y.grade_scalar(name, k == 1 ? 1 : Math.max(nn, np) / (nn + np));
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_cross_validation(gen = false, name = "", seed = "rand", n = 6) {
    Y.rand_seed(seed);
    let fold = Y.rand_elem([2, 3, 6]);
    let nn = Y.rand_int(0, 1) * 2 + 1;
    let every = n / fold;
    let x = Y.rand_unique_int_vec(-10, 10, n);
    x = x.sort((a, b) => a - b);
    let y = Y.rand_int(0, 1, n);
    if (gen) {
        Y.set_blank(name, ["fold", "nn", "every", "every2"], [fold, nn, every, every]);
        Y.set_blank(name, Y.str_seq(1, n, 1, "x"), x);
        Y.set_blank(name, Y.str_seq(1, n, 1, "y"), y);
    }
    else Y.grade_binary(name, 1);
}

/**
 * Fall 2017 Final Q18
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_knn_last(gen = false, name = "", seed = "rand", n = 6) {
    Y.rand_seed(seed);
    let x = Y.sort(Y.rand_unique_int_vec(-10, 10, n - 1));
    if (gen) Y.set_blank(name, ["n", "x"], [n, "$ " + Y.mat_to_str([x])]);
    else Y.grade_scalar(name, 2 * x[n - 2] - x[n - 4]);
}

/**
 * Fall 2017 Final Q18
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_knn_vowel(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let set = Y.sort(Y.rand_unique_int_vec(65, 90, 5)); // TODO Change to 89
    let point = Y.rand_int(1, set.length - 1);
    if (set[point] + 1 != set[point + 1]) set.splice(point, 0, set[point] + 1);
    else if (set[point] - 1 != set[point - 1]) set.splice(point - 1, 0, set[point] - 1);
    set = Y.sort(set);
    if (gen) Y.set_blank(name, "zero", set.map(s => String.fromCharCode(s)).join(", "));
    else {
        let run = 0;
        for (let i = 0; i < set.length - 1; i++) {
            if (set[i] + 1 == set[i + 1]) run++;
        }
        let ans = Y.get_num(Y.get_ans(name));
        if (ans % 2 == 1 && ans >= run * 2 + 1) Y.grade_binary(name, 1);
        else Y.grade_binary(name, 0);
    }
}

/**
 * Fall 2009 Final Q10
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_feature_range(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let d = Y.rand_int(3, 6);
    let x = Y.rand_int(2, 5);
    let dist = Y.rand_elem(["Euclidean", "Manhattan"]);
    if (gen) Y.set_blank(name, ["d", "x", "xp", "dist"], [d, x, x, dist]);
    else {
        let l = (dist == "Euclidean" ? 2 : 1);
        Y.grade_vector(name, [1, Math.pow(d * Math.pow(x, l), 1 / l)]);
    }
}

/**
 * Fall 2006 Midterm Q1
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_min_knn(gen = false, name = "", seed = "rand", nk = 6) {
    Y.rand_seed(seed);
    let n = Y.rand_int(5, 10) * 100;
    let rest = Y.rand_int(3, Math.floor(n / 4) - 1, nk - 4);
    rest = rest.map(ri => ri * 2 + 1);
    let k = Y.shuffle([1, n - 1, Math.round(n / 4) * 2 + 1, 3, ...rest]);
    let s = Y.rand_int(1, 4) * 100;
    if (gen) Y.set_blank(name, ["n", "nk", "k", "ns"], [n, nk, "$ " + Y.vec_to_str(k), s]);
    else Y.grade_scalar(name, [1, n - 1]); // TODO make it back to 1
}
//#endregion

//#region Decision Tree
/**
 * Fall 2016 Final Q11
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_d_tree_cts_threshold(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let x = Y.round_vec(Y.rand_int(-4, 4, 8), 2);
    if (gen) Y.set_blank(name, "x", "$ [" + Y.vec_to_str(x) + "]");
    else Y.grade_scalar(name, Y.count_unique(x) + 1);
}

/**
 * Fall 2014 Midterm Q9, Fall 2012 Final Q6
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_d_tree_train_size(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let d = Y.rand_int(3, 5);
    let c = Y.rand_int(2, 4);
    let least = Y.rand_int(10, 20);
    if (gen) Y.set_blank(name, ["d", "c", "least"], [d, c, least]);
    else Y.grade_scalar(name, least * Math.pow(c, d));
}

/**
 * Fall 2014 Midterm Q10
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_entropy_constant(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let n = Y.rand_int(3, 9);
    if (gen) Y.set_blank(name, "n", n);
    else Y.grade_scalar(name, Y.round(Math.log(n) / Math.log(2), 4));
}

/**
 * Fall 2013 Final Q12, Fall 2011 Midterm Q4, Fall 2010 Final Q10, Fall 2006 Final Q11, Fall 2005 Final Q11
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_entropy(gen = false, name = "", seed = "rand", n = 2) {
    Y.rand_seed(seed);
    let pn = Y.rand_int(1, 5, n);
    let denom = Y.vec_sum(pn);
    let frac = pn.map(p => "$ " + Y.frac_to_str(p, denom));
    let prob = pn.map(p => p / denom);
    if (gen) Y.set_blank(name, Y.str_seq(1, n, 1, "p"), frac);
    else Y.grade_scalar(name, Y.entropy_prob(prob));
}

/**
 * Fall 2012 Final Q5, Fall 2011 Midterm Q5
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_mutual_info_constant(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let f = [1, Y.rand_int(2, 4)];
    f.push(f[1] + 1, f[1] + Y.rand_int(2, 4));
    if (gen) Y.set_blank(name, Y.str_seq(1, 4, 1, "f", ""), f);
    else Y.grade_scalar(name, Y.entropy_count([f[1], f[3] - f[1]]) - 1 / f[3] * 0 - (f[3] - 1) / f[3] * Y.entropy_count([f[1] - 1, f[3] - f[1]]));
}

/**
 * Spring 2018 Midterm Q8, Fall 2006 Final Q13, Fall 2006 Midterm Q10, Fall 2005 Final Q13, Fall 2005 Midterm Q10
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_cond_entropy_table(gen = false, name = "", seed = "rand", n = 8) {
    Y.rand_seed(seed);
    let a = Y.rand_int(0, 1, n);
    let b = Y.rand_int(0, 1, n);
    if (gen) {
        Y.set_blank(name, Y.str_seq(1, n, 1, "a"), a.map(i => i == 0 ? "F" : "T"));
        Y.set_blank(name, Y.str_seq(1, n, 1, "b"), b.map(i => i == 0 ? "F" : "T"));
    }
    else Y.grade_scalar(name, Y.cond_entropy(b, a));
}

/**
 * Spring 2018 Midterm Q8
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_count_candidate(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let n = Y.rand_int(6, 10);
    let c = Y.rand_int(2, 4);
    let k = Y.rand_int(2, 6);
    if (gen) Y.set_blank(name, ["n", "class", "k"], [n, c, k]);
    else Y.grade_scalar(name, c * n - k);
}

/**
 * Fall 2011 Final Q11
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_complete_info_gain(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let c = Y.rand_int(0, 25, 4);
    let n = Y.vec_sum(c);
    let ig = Y.round(Y.info_gain(c), 2);
    if (gen) Y.set_blank(name, ["n", "c00", "c11", "ig"], [n, c[0], c[3], ig]);
    else {
        let ans = Y.get_ans_vec(name);
        if (ans.length != 2) Y.grade_vector(name, [1, 1]);
        else {
            let cig = Y.info_gain([c[0], ans[0], ans[1], c[3]]);
            if (Y.close_to(cig, ig, 2)) Y.grade_binary(name, 1);
            else Y.grade_binary(name, 0, -1, "The information gain according to the numbers you entered is " + cig.toFixed(4) + ", try (" + c[1] + ", " + c[2] + ").");
        }
    }
}

/**
 * Fall 2012 Final Q17, Fall 2009 Final Q11
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_max_tree_accuracy(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let n = Y.rand_int(1, 9) * 10000;
    let m = Y.rand_int(10, 20);
    if (gen) Y.set_blank(name, ["n", "m"], [n, m]);
    else Y.grade_vector(name, [0.5, 1]);
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_max_entropy(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let n = Y.rand_int(5, 10) * 2;
    let max = Y.rand_elem(["max", "min"]);
    if (gen) Y.set_blank(name, ["n", "max"], [n, max]);
    else {
        let c = Y.get_ans_vec(name);
        if (max == "max" && c[0] == c[1]) Y.grade_binary(name, 1);
        else if (max == "min" && c[0] * c[1] == 0) Y.grade_binary(name, 1);
        else Y.grade_binary(name, 0);
    }
}
//#endregion

//#region Natural Language
/**
 * Fall 2018 Midterm Q12
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 * @param {number} delta Delta in delta smoothing
 */
export function q_smoothing(gen = false, name = "", seed = "rand", delta = 1) {
    Y.rand_seed(seed);
    let type = Y.rand_int(100, 1000);
    let total = Y.rand_int(1000, 10000);
    let word = Y.rand_int(0, 10);
    if (gen) Y.set_blank(name, ["type", "corpus", "word", "delta"], [type, total, word, delta]);
    else Y.grade_scalar(name, (word + delta) / (type + total));
}

/**
 * Fall 2017 Final Q1
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 * @param {number} n Number of words
 */
export function q_zip_f_ratio(gen = false, name = "", seed = "rand", n = 10) {
    Y.rand_seed(seed);
    let r = Y.rand_unique_int_vec(1, n, 2);
    if (gen) Y.set_blank(name, ["r1", "r2"], r);
    else Y.grade_scalar(name, 1.0 * r[1] / r[0]);
}

/**
 * Fall 2017 Midterm Q7, Fall 2016 Final Q4
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_word_mle(gen = false, name = "", seed = "rand", smooth = 0) {
    Y.rand_seed(seed);
    let n = Y.rand_int(150, 200);
    let m = Y.rand_int(20, 40);
    let first = Y.rand_int(50, 100);
    let second = Y.rand_int(50, 100);
    if (gen) Y.set_blank(name, ["n", "m", "first", "second"], [n, m, first, second]);
    else Y.grade_scalar(name, (m + smooth) / (first + smooth * n));
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_two_cdf(gen = false, name = "", seed = "rand", vocab = ["I", "am", "G" + "root"]) {
    Y.rand_seed(seed);
    let n = vocab.length;
    let t = Y.fix_round_by_row(Y.round_mat(Y.rand_transition(n, n), 2));
    let u1 = Y.round(Y.rand(0, 1), 2);
    let u2 = Y.round(Y.rand(0, 1), 2);
    if (gen) Y.set_blank(name, ["transition", "u1", "u2"], ["$ " + Y.mat_to_str(t, 2), u1, u2]);
    else {
        let w1 = Y.cdf_inversion(Y.get_cdf(Y.get_row(t, 0)), u1);
        let w2 = Y.cdf_inversion(Y.get_cdf(Y.get_row(t, w1)), u2);
        Y.grade_vector(name, [w1, w2]);
    }
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_skip_markov_chain(gen = false, name = "", seed = "rand", vocab = ["I", "am", "G" + "root"]) {
    Y.rand_seed(seed);
    let n = vocab.length;
    let t = Y.fix_round_by_row(Y.round_mat(Y.rand_transition(n, n), 2));
    let w3 = Y.rand_int(0, n - 1);
    let w1 = Y.rand_int(0, n - 1);
    if (gen) Y.set_blank(name, ["transition", "w1", "w3"], ["$ " + Y.mat_to_str(t, 2), vocab[w1], vocab[w3]]);
    else Y.grade_scalar(name, Y.vec_dot(Y.get_row(t, w1), Y.get_col(t, w3)));
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_mle_sum(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let s = Y.rand_elem([0, 1, 1, 2]);
    let c = Y.rand_int(1, 10, 8);
    if (gen) Y.set_blank(name, ["s", "c000", "c001", "c010", "c011", "c100", "c101", "c110", "c111"], [s, ...c]);
    else {
        if (s == 0) Y.grade_scalar(name, c[4] / (c[4] + c[0]));
        if (s == 1) Y.grade_scalar(name, (c[5] + c[6]) / (c[1] + c[2] + c[5] + c[6]));
        if (s == 2) Y.grade_scalar(name, c[7] / (c[3] + c[7]));
    }
}

/**
 * Fall 2009 Final Q13
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_markov_trip(gen = false, name = "", seed = "rand", location = ["New York", "Baltimore", "Washington D.C."]) {
    Y.rand_seed(seed);
    let pnn = Y.round(Y.rand(0.1, 0.9), 2);
    let pnb = Y.round(1 - pnn);
    let pbb = Y.round(Y.rand(0.1, 0.9), 2);
    let pbw = Y.round(1 - pbb);
    let trip = Y.rand_int(1, 2);
    if (gen) Y.set_blank(name, ["pnn", "pnb", "pbb", "pbw", "trip"], [pnn, pnb, pbb, pbw, location[trip]]);
    else Y.grade_scalar(name, [1, 1 - pnn * pnn, pnb * pbw][trip]);
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_root_gram(gen = false, name = "", seed = "rand", vocab = ["I", "am", "G" + "root"], gram = "uni", n = 5, nt = 3) {
    Y.rand_seed(seed);
    let m = vocab.length;
    let train = Y.rand_int(0, m - 1, n);
    let test = Y.rand_int_not(0, m - 1, train[n - 1], nt);
    if (gen) Y.set_blank(name, ["train", "gram", "test", "first"], [train.map(ti => vocab[ti]).join(" "), gram, test.map(ti => vocab[ti]).join(" "), vocab[test[0]]]);
    else {
        if (gram == "uni") {
            let dist = Y.distribution(train, m);
            Y.grade_scalar(name, test.reduce((s, ti, i) => i == 0 ? 1 : s * dist[ti], 1));
        }
        else {
            let tran = Y.transition(train, m);
            Y.grade_scalar(name, test.reduce((s, ti, i) => (i == 0 ? 1 : s * tran[test[i - 1]][ti]), 1));
        }
    }
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_root_transition(gen = false, name = "", seed = "rand", vocab = ["I", "am", "G" + "root"], n = 6) {
    Y.rand_seed(seed);
    let m = vocab.length;
    let train = Y.rand_int(0, m - 1, n);
    if (gen) {
        Y.set_blank(name, Y.str_seq(1, m, 1, "v"), vocab);
        Y.set_blank(name, "train", train.map(ti => vocab[ti]).join(" "));
    }
    else Y.grade_matrix(name, Y.transition(train));
}
//#endregion

//#region Computer Vision
/**
 * Fall 2009 Final Q2
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_kernel_1d(gen = false, name = "", seed = "rand", n = 3) {
    Y.rand_seed(seed);
    let fs = [{ f: "sqrt(x) sqrt(y)", phi: x => Math.sqrt(x) },
    { f: "x * y", phi: x => x },
    { f: "x^2 * y^2", phi: x => x * x },
    { f: "exp(x + y)", phi: x => Math.exp(x) },
    { f: "2^(x + y)", phi: x => Math.pow(2, x) },
    { f: "1", phi: x => 1 }];
    let cof = Y.rand_int(1, 10, n);
    let k = Y.rand_subset(fs, n);
    let x = Y.rand_int(1, 10);
    if (gen) {
        Y.set_blank(name, Y.str_seq(1, 3, 1, "k"), k.map((ki, i) => "$ " + cof[i] + " * " + ki.f));
        Y.set_blank(name, "x", x);
    }
    else Y.grade_vector(name, k.map((ki, i) => Math.sqrt(cof[i]) * ki.phi(x)));
}

// TODO Fix this next year
/**
 * Fall 2019 Final Q15, Fall 2017 Final Q5, Fall 2017 Midterm Q9, Fall 2017 Midterm Q11
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_count_weight_cnn(gen = false, name = "", seed = "rand", padding = false, correct = false) {
    Y.rand_seed(seed);
    let filter = Y.rand_int(1, 3) * 2 + 1;
    let pool = Y.rand_int(2, 4);
    let image = Y.rand_int(2, 4) * filter * pool + filter - 1;
    if (padding) image -= (filter - 1);
    let map = Y.rand_int(2, 4);
    let out = Y.rand_int(3, 6);
    if (gen) Y.set_blank(name, ["image1", "image2", "filter1", "filter2", "map", "pool1", "pool2", "pool3", "out"], [image, image, filter, filter, map, pool, pool, pool, out]);
    else {
        if (correct) {
            let pooled = [Math.floor(image / pool), image / pool];
            let check = pooled.map(pi => Math.floor(filter * filter * map + pi * pi * map * out));
            Y.grade_scalar(name, check, -1, "", 0);
        }
        else {
            let pooled = (padding ? Math.floor(image / pool) : Math.floor((image - filter + 1) / pool));
            Y.grade_scalar(name, filter * filter * map + pooled * pooled * map * out);
        }
    }
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_convolution(gen = false, name = "", seed = "rand", n = 3, k = 3) {
    Y.rand_seed(seed);
    let image = Y.rand_int(-10, 10, n, n);
    let filter = Y.zero_mat(k, k);
    filter[Y.rand_int(0, k - 1)][Y.rand_int(0, k - 1)] = 1;
    filter[Y.rand_int(0, k - 1)][Y.rand_int(0, k - 1)] = 1;
    if (gen) Y.set_blank(name, ["image", "filter"], ["$ " + Y.mat_to_str(image), "$ " + Y.mat_to_str(filter)]);
    else Y.grade_matrix(name, Y.convolution(image, filter));
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_pooling(gen = false, name = "", seed = "rand", type = "max", n = 4) {
    Y.rand_seed(seed);
    let image = Y.rand_int(-10, 10, n, n);
    if (gen) Y.set_blank(name, "image", "$ " + Y.mat_to_str(image));
    else Y.grade_matrix(name, Y.pooling(image, type, 2));
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_gradient_magnitude(gen = false, name = "", seed = "rand", filter = 2, n = 3) {
    Y.rand_seed(seed);
    let image = Y.rand_int(-10, 10, n, n);
    if (gen) Y.set_blank(name, "image", "$ " + Y.mat_to_str(image));
    else {
        let fx = (filter == 2 ? [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]] : [[0, 0, 0], [-1, 0, 1], [0, 0, 0]]);
        let fy = (filter == 2 ? [[-1, -2, -1], [0, 0, 0], [1, 2, 1]] : [[0, -1, 0], [0, 0, 0], [0, 1, 0]]);
        let dx = Y.convolution(image, fx, (n - 1) / 2, (n - 1) / 2);
        let dy = Y.convolution(image, fy, (n - 1) / 2, (n - 1) / 2);
        Y.grade_scalar(name, Y.l_norm([dx, dy], 2), -1, "The gradient vector at the center pixel is (" + dx + ", " + dy + ").");
    }
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_gradient_direction(gen = false, name = "", seed = "rand", n = 3) {
    Y.rand_seed(seed);
    let dx = Y.rand_int(-10, 10, n, n);
    let dy = Y.rand_int(-10, 10, n, n);
    if (gen) Y.set_blank(name, ["gx", "gy"], ["$ " + Y.mat_to_str(dx), "$ " + Y.mat_to_str(dy)]);
    else {
        let c = (n - 1) / 2;
        let a = Math.atan2(dy[c][c], dx[c][c]);
        let bin = 0;
        if (a > 0 && a <= Math.PI / 2) bin = 1;
        else if (a > Math.PI / 2 && a <= Math.PI) bin = 2;
        else if (a >= -Math.PI / 2 && a < -Math.PI) bin = 3;
        else if (a <= 0 && a > -Math.PI / 2) bin = 4;
        Y.grade_scalar(name, bin);
    }
}
//#endregion

//#region Probability
/**
 * Spring 2018 Final Q22, Spring 2018 Final Q23, Fall 2018 Midterm Q11, Fall 2017 Final Q20, Fall 2010 Final Q18
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 * @param {string[]} y The document names
 * @param {string[]} x The word names
 * @param {number} t The number of words chosen
 */
export function q_bayes_rule(gen = false, name = "", seed = "rand", y = ["A", "B"], x = ["H", "T"], t = 2) {
    Y.rand_seed(seed);
    let n = y.length;
    let m = x.length;
    let doc_prob = Y.rand_int(1, 4, n);
    let doc_total = Y.vec_sum(doc_prob);
    let word_prob = Y.rand_int(1, 4, n, m);
    let word_total = Y.row_sum(word_prob);
    let doc = Y.rand_int(0, n - 1);
    let word = Y.rand_int(0, m - 1, t);
    if (gen) {
        Y.set_blank(name, Y.str_seq(1, y.length, 1, "p"), word_prob.map((p, i) => "$ " + Y.frac_to_str(p[0], word_total[i])));
        Y.set_blank(name, Y.str_seq(1, y.length - 1, 1, "q"), doc_prob.map(p => "$ " + Y.frac_to_str(p, doc_total)));
        Y.set_blank(name, ["doc", "words"], [y[doc], word.reduce((s, i) => s + x[i], "")]);
    }
    else {
        let dp = word.reduce((s, w) => s * word_prob[doc][w] / word_total[doc], 1) * doc_prob[doc] / doc_total;
        let tp = doc_prob.reduce((s, p, i) => s + word.reduce((ss, w) => ss * word_prob[i][w] / word_total[i], 1) * p / doc_total, 0);
        Y.grade_scalar(name, dp / tp);
    }
}

/**
 * Fall 2017 Midterm Q6
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_bird_flu(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let p1d = Y.rand_int(2, 10);
    let p1n = Y.rand_int(1, p1d - 1);
    let q1d = Y.rand_int(2, 10);
    let q1n = Y.rand_int(1, q1d - 1);
    let pcd = Y.rand_int(2, 10);
    let pcn = Y.rand_int(1, pcd - 1);
    if (gen) Y.set_blank(name, ["p1", "q1", "pc"], ["$ " + Y.frac_to_str(p1n, p1d), "$ " + Y.frac_to_str(q1n, q1d), "$ " + Y.frac_to_str(pcn, pcd)]);
    else Y.grade_scalar(name, 1 - pcn / pcd);
}

/**
 * Fall 2017 Midterm Q1
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_cycle_change(gen = false, name = "", seed = "rand", x = ["green", "yellow", "red"]) {
    Y.rand_seed(seed);
    let n = x.length;
    let rep = Y.rand_int(2, 10, n);
    let c = Y.rand_int(0, n - 1);
    if (gen) {
        let s = Y.seq(1, n, 1);
        let list = s.map(i => "x" + i);
        Y.set_blank(name, list, rep);
        Y.set_blank(name, ["xc", "xn"], [x[c], x[(c + 1) % n]]);
    }
    else Y.grade_scalar(name, 1 / rep[c]);
}

/**
 * Fall 2017 Midterm Q2, Fall 2014 Final Q3
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_specify_joint(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let na = Y.rand_int(2, 6);
    let nb = Y.rand_int(2, 6);
    let al = Y.combine_str(Y.seq(1, na, 1), ", ", "{", "}");
    let bl = Y.combine_str(Y.seq(1, nb, 1), ", ", "{", "}");
    if (gen) Y.set_blank(name, ["al", "bl"], [al, bl]);
    else Y.grade_scalar(name, na * (nb - 1));
}

/**
 * Fall 2016 Midterm Q5
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_in_dep_coin(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let p = Y.round(Y.rand_not(0, 1, 0), 2);
    let n = Y.rand_int(3, 10);
    let next = Y.rand_int(3, 5);
    if (gen) Y.set_blank(name, ["p", "n", "next"], [p, n, next]);
    else Y.grade_scalar(name, 1 - Math.pow(p, next));
}

/**
 * Fall 2017 Final Q3, Fall 2006 Final Q19, Fall 2005 Final Q19
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 * @param {string[]} x The names of variable values
 */
export function q_mle_conditional(gen = false, name = "", seed = "rand", x = ["N", "Y"]) {
    Y.rand_seed(seed);
    let count = Y.rand_int(1, 5, 8);
    let n = Y.vec_sum(count);
    let y = Y.rand_int(0, 1);
    let x1 = Y.rand_int(0, 1);
    let x2 = Y.rand_int(0, 1);
    if (gen) {
        Y.set_blank(name, ["n", "y", "x1", "x2"], [n, x[y], x[x1], x[x2]]);
        Y.set_blank(name, Y.str_seq(0, 7, 1, "d"), count);
    }
    else {
        let px = count[4 * x1 + 2 * x2 + y];
        let py = count[4 * x1 + 2 * x2 + 1 - y];
        Y.grade_scalar(name, px / (px + py));
    }
}

/**
 * Fall 2011 Midterm Q18
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_n_gram_count(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let v = Y.rand_int(50, 100);
    let n = Y.rand_int(3, 6);
    if (gen) Y.set_blank(name, ["n", "v"], [n, v]);
    else Y.grade_scalar(name, (v - 1) * Math.pow(v, n - 1));
}

/**
 * Fall 2011 Midterm Q13
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_mask_half(gen = false, name = "", seed = "rand", inv = true) {
    Y.rand_seed(seed);
    let np = inv ? Y.round(Y.rand(0.5, 1), 2) : Y.round(Y.rand(0, 1), 2);
    if (gen) Y.set_blank(name, "np", np);
    else Y.grade_scalar(name, inv ? 1 - (np - 0.5) / 0.5 : 0.5 + 0.5 * (1 - np));
}

/**
 * Fall 2013 Final Q11, Fall 2012 Midterm Q9, Fall 2011 Midterm Q14
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_switch_cond(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let m = Y.rand_int(2, 6);
    let pa = Y.round(Y.rand(0, 1), 2);
    if (gen) Y.set_blank(name, ["m", "pa"], [m, pa]);
    else Y.grade_scalar(name, pa / m);
}

/**
 * Fall 2019 Final Q20, Fall 2013 Final Q15, Fall 2011 Final Q4, Fall 2010 Final Q11
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_missing_ind(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let c = Y.rand_int(1, 5, 2);
    let d = Y.vec_sum(c) * 2;
    if (gen) Y.set_blank(name, ["p0", "p1"], c.map(ci => "$ " + ci + "/" + d));
    else {
        let ans = Y.get_ans_vec(name);
        if (ans.length < 2 || !Y.close_to(c[0] / d + c[1] / d + ans[0] + ans[1], 1)) Y.grade_binary(name, 0, -1, "The probabilities do not sum up to 1.");
        else {
            let p00 = c[0] / d;
            let p01 = c[1] / d;
            let p10 = ans[0];
            let p11 = ans[1];
            let b0 = p00 + p01;
            let b1 = p10 + p11;
            let a0 = p00 + p10;
            let a1 = p01 + p11;
            if (Y.close_to(p00, b0 * a0, 4) && Y.close_to(p01, b0 * a1, 4) && Y.close_to(p10, b1 * a0, 4) && Y.close_to(p11, b1 * a1, 4)) Y.grade_binary(name, 1);
            else Y.grade_binary(name, 0, -1, "The variables are not independent.");
        }
    }
}

/**
 * Fall 2019 Final Q18, Fall 2019 Final Q19, Fall 2017 Final Q6
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_forget_homework(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let ff = Y.round(Y.rand(0, 1), 2);
    let nff = Y.round(Y.rand(0, 1), 2);
    let f = Y.round(Y.rand(0, 1), 2);
    if (gen) Y.set_blank(name, ["ff", "nff", "f"], [ff, nff, f]);
    else Y.grade_scalar(name, ff * f / (ff * f + nff * (1 - f)));
}

/**
 * Spring 2018 Final Q20, Fall 2016 Final Q3, Fall 2009 Final Q6
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_not_given(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let pa = Y.round(Y.rand(0, 1), 2);
    let pb = Y.round(Y.rand(0, 1), 2);
    let pab = Y.round(Y.rand(0, Math.min(0.99, pa / (1 - pb) - 0.01)), 2);
    if (gen) Y.set_blank(name, ["pa", "pb", "pab"], [pa, pb, pab]);
    else Y.grade_scalar(name, pa / pb * (1 - pab * (1 - pb) / pa));
}

/**
 * Fall 2017 Midterm Q9, Fall 2014 Midterm Q20, Fall 2009 Final Q5
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_prob_sum(gen = false, name = "", seed = "rand", nc = 5) {
    Y.rand_seed(seed);
    let pab = Y.round(Y.rand(0.1, 0.9), 2);
    let choices = Y.round_vec(Y.rand_unique_vec(0.1, 0.9, nc), 2);
    choices[Y.rand_int(0, nc - 1)] = 0;
    choices[Y.rand_int(0, nc - 1)] = 1;
    if (gen) {
        Y.set_blank(name, "pab", pab);
        Y.set_choices(name, choices);
    }
    else Y.grade_choices(name, choices.map(c => c >= pab));
}

/**
 * Fall 2014 Final Q10, Fall 2006 Final Q18, Fall 2005 Final Q18
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_children_boy(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let n = Y.rand_int(3, 5);
    if (gen) Y.set_blank(name, ["n1", "n2"], [n, n]);
    else {
        let pow = Math.pow(2, n - 1);
        let pow2 = pow * 2;
        Y.grade_vector(name, [1 - 1 / pow, 1 - 1 / (pow2 - 1)]);
    }
}

/**
 * Fall 2016 Final Q17
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_joint_table(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let k = Y.rand_int(3, 6);
    let m = Y.rand_int(3, 6);
    let x = Y.rand_int(1, m);
    if (gen) Y.set_blank(name, ["k", "m", "x"], [k, m, x]);
    else Y.grade_scalar(name, Math.pow(m, k - 1));
}
//#endregion

//#region Bayesian Network
/**
 * Fall 2016 Final Q18, Fall 2011 Midterm Q20
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_binary_naive_bayes(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let nc = Y.rand_int(5, 20) * 2;
    let d1y = Y.rand_int(nc / 2, nc - 1) * 2;
    let d2y = Y.rand_int(nc / 2, nc - 1) * 2;
    let x1 = Y.rand_int(0, 1);
    let x2 = Y.rand_int(0, 1);
    if (gen) Y.set_blank(name, ["n", "py", "p1y", "p2y", "x1", "x2"], [nc, "$ 1 / " + nc, "$ y / " + d1y, "$ y / " + d2y, x1, x2]);
    else {
        if (x1 == x2 && x1 == 1) Y.grade_scalar(name, nc);
        else if (x1 == x2) Y.grade_scalar(name, 1);
        else Y.grade_scalar(name, ((1 - x1) * d1y + (1 - x2) * d2y) / 2);
    }
}

/**
 * Fall 2019 Final Q22, Spring 2018 Final Q24, Spring 2018 Final Q25, Fall 2019 Final Q23, Fall 2014 Final Q9, Fall 2006 Final Q20, Fall 2005 Final Q20
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_binary_bayes_net(gen = false, name = "", seed = "rand", struct = "A->B->C", prob = "ABC", var_name = ["A", "B", "C"]) {
    Y.rand_seed(seed + struct);
    let n = 0;
    if (struct == "A->B->C" || struct == "A<-B->C") n = 5;
    else if (struct == "A->B<-C") n = 6;
    let abc = Y.rand_int(0, 1, 3);
    let bn = Y.round_vec(Y.rand(0, 1, n), 2);
    if (gen) {
        if (struct == "A->B->C") Y.set_blank(name, ["pa", "pba", "pb-a", "pcb", "pc-b"], bn);
        else if (struct == "A<-B->C") Y.set_blank(name, ["pb", "pab", "pa-b", "pcb", "pc-b"], bn);
        else if (struct == "A->B<-C") Y.set_blank(name, ["pa", "pc", "pb", "pba-c", "pb-ac", "pb-a-c"], bn);
        if (prob == "ABC") Y.set_blank(name, "abc", abc.join(","));
        else if (prob == "A|C") Y.set_blank(name, "abc", abc[0] + "," + abc[2]);
        Y.set_blank(name, ["va", "vb", "vc"], abc);
    }
    else {
        let pa = [];
        let pb = [];
        let pc = [];
        if (struct == "A->B->C") {
            pa = [1 - bn[0], bn[0]];
            pb = [[1 - bn[2], 1 - bn[1]], [bn[2], bn[1]]];
            pc = [[1 - bn[4], 1 - bn[3]], [bn[4], bn[3]]];
        }
        else if (struct == "A<-B->C") {
            pa = [[1 - bn[2], 1 - bn[1]], [bn[2], bn[1]]];
            pb = [1 - bn[0], bn[0]];
            pc = [[1 - bn[4], 1 - bn[3]], [bn[4], bn[3]]];
        }
        else if (struct == "A->B<-C") {
            pa = [1 - bn[0], bn[0]];
            pb = [[[1 - bn[5], 1 - bn[4]], [1 - bn[3], 1 - bn[2]]], [[bn[5], bn[4]], [bn[3], bn[2]]]];
            pc = [1 - bn[1], bn[1]];
        }
        let a = abc[0];
        let b = abc[1];
        let c = abc[2];
        if (prob == "ABC") {
            if (struct == "A->B->C") Y.grade_scalar(name, pa[a] * pb[b][a] * pc[c][b]);
            else if (struct == "A<-B->C") Y.grade_scalar(name, pa[a][b] * pb[b] * pc[c][b]);
            else if (struct == "A->B<-C") Y.grade_scalar(name, pa[a] * pb[b][a][c] * pc[c]);
        }
        else if (prob == "A|C") {
            if (struct == "A->B->C") Y.grade_scalar(name, (pa[a] * pb[0][a] * pc[c][0] + pa[a] * pb[1][a] * pc[c][1]) / (pa[0] * pb[0][0] * pc[c][0] + pa[0] * pb[1][0] * pc[c][1] + pa[1] * pb[0][1] * pc[c][0] + pa[1] * pb[1][1] * pc[c][1]));
            else if (struct == "A<-B->C") Y.grade_scalar(name, (pa[a][0] * pb[0] * pc[c][0] + pa[a][1] * pb[1] * pc[c][1]) / ((pa[0][0] * pb[0] * pc[c][0] + pa[0][1] * pb[1] * pc[c][1]) + (pa[1][0] * pb[0] * pc[c][0] + pa[1][1] * pb[1] * pc[c][1])));
            else if (struct == "A->B<-C") Y.grade_scalar(name, pa[a]);
        }
    }
}

/**
 * Fall 2011 Midterm Q15
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_cpt_count(gen = false, name = "", seed = "rand", network = "A->B->C") {
    Y.rand_seed(seed);
    let n = Y.rand_int(2, 4, 3);
    if (gen) Y.set_blank(name, ["na", "nb", "nc"], n);
    else {
        if (network == "A->B->C") Y.grade_scalar(name, n[0] - 1 + (n[1] - 1) * n[0] + (n[2] - 1) * n[1]);
        else if (network == "A<-B->C") Y.grade_scalar(name, n[1] - 1 + (n[0] - 1) * n[1] + (n[2] - 1) * n[1]);
        else if (network == "A->B<-C") Y.grade_scalar(name, n[0] - 1 + n[2] - 1 + (n[1] - 1) * n[0] * n[2]);
    }
}

/**
 * Spring 2018 Final Q21, Fall 2016 Final Q4, Fall 2011 Midterm Q16
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_cpt_smooth(gen = false, name = "", seed = "rand", nf = 6, delta = 1) {
    Y.rand_seed(seed);
    let count = Y.rand_int(0, 10, nf);
    let n = Y.vec_sum(count);
    if (gen) Y.set_blank(name, ["n", "count"], [n, Y.vec_to_str(count, 0, ", ", "", "")]);
    else Y.grade_vector(name, count.map(c => (c + delta) / (n + nf * delta)));
}

/**
 * Fall 2019 Final Q27
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_cpt_count_naive(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let n = Y.rand_int(2, 6, 4);
    n[0] = n[1];
    if (gen) Y.set_blank(name, ["rv0", "rv", "nx", "ny"], n);
    else Y.grade_scalar(name, n[3] - 1 + (n[2] - 1) * n[3] * n[1]);
}

/**
 * Spring 2017 Final Q7
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_multi_naive_bayes(gen = false, name = "", seed = "rand", n = 3) {
    Y.rand_seed(seed);
    let prior = Y.round(Y.rand(0, 1), 2);
    let like = Y.round_mat(Y.rand(0, 1, 2, n), 2);
    let abc = Y.rand_int(0, 1, n);
    if (gen) {
        Y.set_blank(name, ["prior", "abc"], [prior, abc.join(", ")]);
        Y.set_blank(name, ["va", "vb", "vc"], abc);
        Y.set_blank(name, Y.str_seq(1, n, 1, "p"), like[0]);
        Y.set_blank(name, Y.str_seq(1, n, 1, "pn"), like[1]);
    }
    else Y.grade_scalar(name, prior * like[0].reduce((s, li, i) => s * (abc[i] == 0 ? 1 - li : li), 1) + (1 - prior) * like[1].reduce((s, li, i) => s * (abc[i] == 0 ? 1 - li : li), 1));
}

/**
 * Spring 2017 Final Q8
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_count_bayes_net(gen = false, name = "", seed = "rand", n = 5) {
    Y.rand_seed(seed);
    let g = Y.rand_dag(n);
    if (gen) {
        let net = Y.mat_to_digraph(g);
        Y.scale_bounding_box_to_canvas(net, "canvas_" + name);
        Y.set_state("move", "canvas_" + name);
        Y.two_paint("canvas_" + name, net);
    }
    else {
        let gt = Y.transpose(g);
        Y.grade_scalar(name, gt.reduce((s, gi) => s + Math.pow(2, Y.vec_sum(gi)), 0));
    }
}

/**
 * Spring 2008 Final Q4
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_hmm(gen = false, name = "", seed = "rand", states = ["happy", "hungry", "wet diaper"], observations = ["smile", "cry"], ns = 2, observed = true, hidden = false) {
    Y.rand_seed(seed);
    let nt = states.length;
    let no = observations.length;
    let t = Y.fix_round_by_row(Y.round_mat(Y.rand_transition(nt, nt), 2), 1, 2);
    let o = Y.fix_round_by_row(Y.round_mat(Y.rand_transition(nt, no), 2), 1, 2);
    let s = Y.rand_int(0, no - 1, ns);
    let ss = s.map(si => observations[si]);
    let h = Y.rand_int(0, nt - 1, ns);
    h[0] = 0;
    let hh = h.map(si => states[si]);
    let ini = Y.zero_vec(0, nt);
    ini[0] = 1;
    if (gen) {
        Y.set_blank(name, Y.flatten(Y.str_double_seq(0, nt - 1, 1, 0, nt - 1, 1, "t")), Y.flatten(t));
        Y.set_blank(name, Y.flatten(Y.str_double_seq(0, no - 1, 1, 0, nt - 1, 1, "o")), Y.flatten(o));
        if (observed) Y.set_blank(name, ["sq", "seq"], [Y.vec_to_str_line(s), Y.vec_to_str_line(ss)]);
        if (hidden) Y.set_blank(name, ["hq", "heq"], [Y.vec_to_str_line(h), Y.vec_to_str_line(hh)]);
        let objects = Y.prob_to_hmm(ini, t, o);
        Y.scale_bounding_box_to_canvas(objects, "canvas_" + name);
        Y.set_state("move", "canvas_" + name);
        Y.two_paint("canvas_" + name, objects);
    }
    else {
        if (observed) {
            let denom = o[0][s[0]] * t[0].reduce((sum, ti, i) => sum + ti * o[i][s[1]], 0);
            if (hidden) Y.grade_scalar(name, o[0][s[0]] * t[0][h[1]] * o[h[1]][s[1]]);
            else Y.grade_scalar(name, denom);
        }
        else Y.grade_scalar(name, t[0][h[1]] * t[h[1]][h[2]]);
    }
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_bayes_net_train(gen = false, name = "", seed = "rand", network = "A->B<-C", n = 8, delta = 1) {
    Y.rand_seed(seed);
    let abc = Y.rand_int(0, 1, 3);
    let data = Y.rand_int(0, 1, n);
    if (gen) {
        Y.set_blank(name, ["va", "vb", "vc"], abc);
        Y.set_blank(name, Y.str_seq(1, n, 1, "b"), data);
    }
    else {
        if (network == "A->B<-C") {
            let bin = abc[0] * 2 + abc[2];
            let ones = 0;
            for (let i = 0; i < n / 4; i++) {
                if (data[n / 4 * bin + i] == abc[1]) ones++;
            }
            Y.grade_scalar(name, (ones + delta) / (n / 4 + delta * 2));
        }
    }
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_reinforce(gen = false, name = "", seed = "rand", states = ["$ s[0]", "$ s[1]", "$ s[2]"], actions = ["$ a[0]", "$ a[1]", "$ a[2]"], step = 2) {
    Y.rand_seed(seed);
    let ns = states.length;
    let na = actions.length;
    let s = Y.rand_int(0, ns - 1, step);
    let a = Y.rand_int(0, na - 1, step);
    let r = Y.rand_int(-5, 5);
    let gam = Y.round(Y.rand(0.1, 0.9), 1);
    let alpha = Y.round(Y.rand(0.1, 0.9), 1);
    let q = Y.rand_int(-5, 5, na, ns);
    if (gen) {
        Y.set_blank(name, ["s0p", "a0p", "r", "gam", "alpha"], [states[s[0]], actions[a[0]], r, gam, alpha]);
        Y.set_blank(name, Y.str_seq(0, step - 1, 1, "s"), s.map(si => states[si]));
        Y.set_blank(name, Y.str_seq(0, step - 1, 1, "a"), a.map(ai => actions[ai]));
        Y.set_blank(name, Y.flatten(Y.str_double_seq(0, na - 1, 1, 0, ns - 1, 1, "q")), Y.flatten(q));
    }
    else {
        let q0 = q[s[0]][a[0]];
        let qp = [q[s[1]][a[1]], Math.max(...q[s[1]])];
        Y.grade_vector(name, qp.map(qi => q0 + alpha * (r + gam * qi - q0)), -1, "", false, -1, true);
    }
}
//#endregion

//#region Principal Component Analysis
/**
 * Fall 2018 Midterm Q13, Fall 2017 Final Q10
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 * @param {number} n_pca Number of principal components
 * @param {number} nd Dimension of x
 */
export function q_pca_new_x(gen = false, name = "", seed = "rand", n_pca = 2, nd = 3) {
    Y.rand_seed(seed);
    let pca = [];
    let v = [];
    let names = [];
    for (let i = 0; i < n_pca; i++) {
        let vec = Y.rand_int(1, 3, nd);
        let vec_norm = Y.norm_sq(vec);
        let vec_name = Y.frac_sqrt_to_str(vec, vec_norm);
        pca.push("$ " + vec_name);
        v.push(Y.vec_mul(vec, 1.0 / Math.sqrt(vec_norm)));
        names.push("v" + (i + 1));
    }
    let x = Y.rand_int(0, 5, nd);
    if (gen) {
        Y.set_blank(name, names, pca);
        Y.set_blank(name, "x", "$ " + Y.vec_to_str(x));
    }
    else {
        let ans = [];
        for (let i = 0; i < n_pca; i++) ans.push(Y.vec_dot(v[i], x));
        Y.grade_vector(name, ans);
    }
}

/**
 * Fall 2018 Midterm Q14
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_proj(gen = false, name = "", seed = "rand", nd = 3) {
    Y.rand_seed(seed);
    let vec = Y.rand_int(1, 3, nd);
    let vec_norm = Y.norm_sq(vec);
    let vec_name = Y.frac_sqrt_to_str(vec, vec_norm);
    let v = Y.vec_mul(vec, 1.0 / Math.sqrt(vec_norm));
    let x = Y.rand_int(0, 5, nd);
    if (gen) Y.set_blank(name, ["x", "v"], ["$ " + Y.vec_to_str(x), "$ " + vec_name]);
    else {
        let ans = Y.vec_mul(v, Y.vec_dot(x, v));
        Y.grade_vector(name, ans);
    }
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_proj_var(gen = false, name = "", seed = "rand", nd = 3) {
    Y.rand_seed(seed);
    let x1 = Y.rand_int(-10, 10, nd);
    let x2 = Y.rand_int(-10, 10, nd);
    let u = Y.rand_basis_vec(nd);
    if (gen) Y.set_blank(name, ["x1", "x2", "u"], ["$ " + Y.vec_to_str(x1), "$ " + Y.vec_to_str(x2), "$ " + Y.vec_to_str(u)]);
    else {
        let ans = Y.variance([Y.vec_dot(x1, u), Y.vec_dot(x2, u)]);
        let normed = Y.variance([Math.abs(Y.vec_dot(x1, u)), Math.abs(Y.vec_dot(x2, u))]);
        Y.grade_scalar(name, ans);
        if (ans != normed) Y.grade_scalar(name, normed);
    }
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_eig_pc(gen = false, name = "", seed = "rand", nd = 3) {
    Y.rand_seed(seed);
    let eig = Y.rand_unique_int_vec(1, 10, nd);
    let mat = Y.zero_mat(nd, nd, 0);
    eig.forEach((e, i) => mat[i][i] = e);
    if (gen) Y.set_blank(name, "sig", "$ " + Y.mat_to_str(mat));
    else Y.grade_vector_as_scalar(name, Y.id_vec(nd, Y.arg_max(eig)));
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_eig_recon(gen = false, name = "", seed = "rand", nd = 3, np = 2) {
    Y.rand_seed(seed);
    let eig = Y.rand_unique_int_vec(1, 10, nd);
    let mat = Y.zero_mat(nd, nd, 0);
    let x = Y.rand_unique_int_vec(-5, 5, nd);
    eig.forEach((e, i) => mat[i][i] = e);
    if (gen) Y.set_blank(name, ["sig", "x"], ["$ " + Y.mat_to_str(mat), "$ " + Y.vec_to_str(x)]);
    else {
        let arg = Y.arg_sort(eig);
        let vec = [];
        for (let i = 0; i < np; i++) vec.push(eig[arg[i]]);
        Y.grade_vector_as_scalar(name, vec);
    }
}
//#endregion

//#region Clustering
/**
 * Fall 2017 Final Q17, Fall 2016 Midterm Q10, Fall 2016 Final Q8, Fall 2014 Midterm Q1, Fall 2012 Final Q2, Fall 2010 Final Q12, Fall 2006 Midterm Q4
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 * @param {number} np Number of points
 */
export function q_cluster_tree(gen = false, name = "", seed = "rand", np = 6, nd = 1, method = "complete") {
    Y.rand_seed(seed + method);
    let x = Y.rand_unique_int_columns(-10, 10, np, nd);
    if (gen) {
        let s = Y.seq(1, np - 1, 1);
        s = s.map(si => "C_" + si);
        let g = Y.mat_to_digraph(Y.zero_mat(np * 2 - 1, np * 2 - 1), [...x.map(xi => xi[0]), ...s]);
        Y.scale_bounding_box_to_canvas(g, "canvas_" + name);
        g.forEach(gi => gi.hard = true);
        Y.set_state("edge", "canvas_" + name);
        Y.two_paint("canvas_" + name, g);
        Y.set_blank(name, "link", method);
        Y.set_blank(name, Y.str_seq(1, np, 1, "p"), x.map(xi => "$ " + Y.vec_to_str(xi)));
    }
    else {
        let cluster = Y.train_h_cluster(x, 1, { l: 2, method: method });
        let ans = cluster.graph;
        let graph = Y.get_ans_graph(name);
        Y.set_ans(Y.mat_to_str_line(graph), name);
        Y.grade_matrix_as_scalar(name, ans);
    }
}

/**
 * Fall 2016 Final Q9, Fall 2014 Midterm Q5, Fall 2012 Final Q3
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_k_cluster_dist(gen = false, name = "", seed = "rand", nd = 1, np = 6, nc = 2, l = nd) {
    Y.rand_seed(seed);
    let x = Y.rand_unique_int_columns(-10, 10, np, nd);
    let c = Y.rand_unique_int_columns(-10, 10, nc, nd);
    if (gen) {
        Y.set_blank(name, Y.str_seq(1, np, 1, "p"), x.map(xi => "$ " + Y.vec_to_str(xi)));
        Y.set_blank(name, Y.str_seq(1, nc, 1, "c"), c.map(ci => "$ " + Y.vec_to_str(ci)));
    } else {
        let old_y = Y.classify_k_means(x, c);
        let old_d = Y.distortion(x, old_y, c, { l: 2 });
        let new_c = Y.center_k_means(x, old_y, c);
        let new_y = Y.classify_k_means(x, new_c);
        let new_d = Y.distortion(x, new_y, new_c, { l: 2 });
        Y.grade_scalar(name, old_d - new_d);
    }
}

/**
 * Fall 2017 Final Q22, Fall 2014 Final Q20, Fall 2013 Final Q14, Fall 2006 Final Q14, Fall 2005 Final Q14
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_k_cluster_center(gen = false, name = "", seed = "rand", nd = 2, np = 4, nc = 2) {
    Y.rand_seed(seed);
    let x = Y.rand_unique_int_columns(-10, 10, np, nd);
    let c = Y.rand_unique_int_columns(-10, 10, nc, nd);
    if (gen) {
        Y.set_blank(name, Y.str_seq(1, np, 1, "p"), x.map(xi => "$ " + Y.vec_to_str(xi)));
        Y.set_blank(name, Y.str_seq(1, nc, 1, "c"), c.map(ci => "$ " + Y.vec_to_str(ci)));
    }
    else {
        let y = Y.classify_k_means(x, c);
        let new_c = Y.center_k_means(x, y, c);
        Y.grade_matrix(name, new_c);
    }
}

/**
 * Fall 2011 Midterm Q2
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_initial_center(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let from = Y.rand_int(1, 5);
    let tto = Y.rand_int(25, 30);
    let k = Y.rand_int(4, 6);
    let c1 = Y.rand_int(5, 25);
    if (gen) Y.set_blank(name, ["from", "to", "k", "c1"], [from, tto, k, c1]);
    else {
        let c = [c1];
        let all = Y.seq(from, tto, 1);
        for (let i = 1; i < k; i++) {
            let nc = Y.farthest_from(all, c);
            c.push(nc);
        }
        Y.grade_vector(name, c.sort((a, b) => a - b));
    }
}

/**
 * Spring 2017 Midterm Q4
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_hac_dist(gen = false, name = "", seed = "rand", link = "complete", nc = 5) {
    Y.rand_seed(seed);
    let dist = Y.reshape(Y.rand_unique_int_vec(1, 100, nc * nc), nc, nc);
    Y.make_dist(dist);
    if (gen) Y.set_blank(name, ["link", "dist"], [link, "$ " + Y.mat_to_str(dist)]);
    else {
        Y.h_cluster_step(dist, Y.seq(0, nc - 1, 1), link, 1);
        let new_dist = Y.remove_negative_row_col(dist);
        Y.grade_matrix(name, new_dist);
    }
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_cluster_given(gen = false, name = "", seed = "rand", nx = 5, left = true) {
    Y.rand_seed(seed);
    let x = Y.rand_unique_int_vec(-10, 10, nx);
    x.sort((a, b) => a - b);
    let c1 = 0;
    if (left) c1 = Math.max(...x) + Y.rand_int(2, 6);
    else c1 = Math.min(...x) - Y.rand_int(2, 6);
    let n = Y.rand_int(1, nx - 1);
    if (gen) Y.set_blank(name, ["x", "c1", "n", "bound"], ["$ [" + Y.vec_to_str(x) + "]", c1, n, (left ? "smallest" : "largest")]);
    else Y.grade_scalar(name, left ? x[nx - n - 1] * 2 - c1 : x[n] * 2 - c1);
}

/**
 * Spring 2019 Midterm Q18 Q19
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
 export function q_linkage(gen = false, name = "", seed = "rand", link = "complete", np = 5) {
    Y.rand_seed(seed);
    let cut = Y.rand_int(-5, 5);
    let c1 = Y.rand_unique_int_vec(-15, cut - 1, np);
    let c2 = Y.rand_unique_int_vec(cut + 1, 15, np);
    if (gen) Y.set_blank(name, ["c1", "c2", "link"], ["$ [" + Y.vec_to_str(c1) + "]", "$ [" + Y.vec_to_str(c2) + "]", link]);
    else Y.grade_scalar(name, Y.cluster_dist(c1, c2, 2, link));
}

/**
 * Spring 2019 Midterm Q23
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
 export function q_empty_cluster(gen = false, name = "", seed = "rand", np = 5, max = true) {
    Y.rand_seed(seed);
    let data = Y.rand_unique_int_vec(-10, 10, np);
    let ext = (max ? Math.min(...data) : Math.max(...data));
    let offset = (max ? -1 : 1) * Y.rand_int(2, 5);
    let c = ext + offset;
    if (gen) Y.set_blank(name, ["data", "c", "max"], ["$ [" + Y.vec_to_str(data) + "]", "$ " + c, max ? "max" : "min"]);
    else Y.grade_scalar(name, ext - offset);
}

/**
 * Spring 2019 Midterm Q24
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
 export function q_min_k_means(gen = false, name = "", seed = "rand", nk = 6) {
    Y.rand_seed(seed);
    let n = Y.rand_int(5, 10) * 100;
    let rest = Y.rand_int(3, Math.floor(n / 4) - 1, nk - 4);
    rest = rest.map(ri => ri * 2 + 1);
    let k = Y.shuffle([1, n - 1, Math.round(n / 4) * 2 + 1, 3, ...rest]);
    if (gen) Y.set_blank(name, ["n", "nk", "k"], [n, nk, "$ " + Y.vec_to_str(k)]);
    else Y.grade_scalar(name, n - 1);
}
//#endregion

//#region Uninformed Search
/**
 * Fall 2018 Midterm Q1, Fall 2016 Midterm Q1, Fall 2010 Final Q3
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_branching(gen = false, name = "", seed = "rand", method = "dfs") {
    Y.rand_seed(seed);
    let branching = Y.rand_int(2, 4);
    let level = Y.rand_int(3, 5);
    if (gen) Y.set_blank(name, ["branch", "level"], [branching, level]);
    else {
        let count = 0;
        for (let i = 0; i <= level; i++) count += Math.pow(branching, i);
        Y.grade_scalar(name, count);
    }
}

/**
 * Fall 2018 Midterm Q2, Fall 2017 Final Q13
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_integer_search(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let c = Y.rand_int(2, 4);
    let goal = 1;
    let path = [goal];
    let n = Y.rand_int(3, 5);
    let suc = `$ ${c} n`;
    for (let i = 1; i < c; i++) suc += `; ${c} n + ${i}`;
    for (let i = 0; i < n; i++) {
        goal = c * goal + Y.rand_int(0, c - 1);
        path.push(goal);
    }
    if (gen) Y.set_blank(name, ["suc", "goal"], [suc, goal]);
    else Y.grade_vector_as_scalar(name, path);
}

/**
 * Fall 2018 Midterm Q3
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_three_puzzle(gen = false, name = "", seed = "rand", nc = 5) {
    Y.rand_seed(seed);
    let goal = Y.shuffle(Y.seq(0, 3, 1));
    let perms = Y.list_permutation([0, 1, 2, 3]);
    let choices = Y.rand_elem(perms, nc);
    if (gen) {
        Y.set_blank(name, ["goal"], ["$" + Y.mat_to_str([[goal[0], goal[1]], [goal[3], goal[2]]])]);
        Y.set_choices(name, choices.map(c => "$ " + Y.mat_to_str([[c[0], c[1]], [c[3], c[2]]])));
    }
    else Y.grade_choices(name, choices.map(c => Y.vec_is_rotation(c.filter(ci => ci > 0), goal.filter(ci => ci > 0))));
}

/**
 * Fall 2018 Midterm Q5
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_search_to_graph(gen = false, name = "", seed = "rand", method = "ids", n = 6) {
    Y.rand_seed(seed + method);
    let graph = Y.rand_tree(n);
    let search = Y.search_explored(graph, method, 0, [n - 1]);
    if (gen) {
        let g = Y.mat_to_digraph(Y.zero_mat(n, n));
        Y.scale_bounding_box_to_canvas(g, "canvas_" + name);
        Y.set_state("edge", "canvas_" + name);
        Y.two_paint("canvas_" + name, g);
        Y.set_blank(name, ["seq", "n", "n2"], ["$ [[" + search + "]]", n - 1, n - 1]);
    }
    else {
        let gan = Y.get_ans_graph(name);
        let ans = Y.search_explored(gan, method, 0, [n - 1]);
        Y.set_ans(Y.mat_to_str_line(gan), name);
        let check = Y.vec_equal(ans, search);
        if (check) Y.grade_binary(name, 1);
        else Y.grade_binary(name, 0, -1, "The expansion path of your graph is " + Y.vec_to_str_line(ans) + ".");
    }
}

/**
 * Fall 2018 Midterm Q5, Fall 2006 Final Q1, Fall 2005 Final Q1
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_graph_to_search(gen = false, name = "", seed = "rand", method = "ids", n = 6) {
    Y.rand_seed(seed + method);
    let graph = Y.rand_tree(n);
    if (gen) {
        let g = Y.mat_to_tree(graph);
        Y.set_blank(name, "n", n - 1);
        Y.scale_bounding_box_to_canvas(g, "canvas_" + name);
        Y.set_state("move", "canvas_" + name);
        Y.two_paint("canvas_" + name, g);
    }
    else {
        let search = Y.search_explored(graph, method, 0, [n - 1]);
        Y.grade_vector_as_scalar(name, search);
    }
}

/**
 * Fall 2018 Midterm Q5
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_search_lucky(gen = false, name = "", seed = "rand", method = "ids") {
    Y.rand_seed(seed + method);
    let b = Y.rand_int(2, 5);
    let d = Y.rand_int(3, 4);
    if (gen) Y.set_blank(name, ["b", "d"], [b, d]);
    else {
        let ans = 0;
        for (let i = 0; i < d; i++) {
            if (method == "ids") {
                for (let j = 0; j <= i; j++) ans += Math.pow(b, j);
            }
            else if (method == "bfs") ans += Math.pow(b, i);
            else if (method == "dfs") ans += 1;
        }
        if (method == "ids") ans += d;
        Y.grade_scalar(name, ans + 1);
    }
}

/**
 * Fall 2016 Final Q2
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_seq_complete_search(gen = false, name = "", seed = "rand", method = "ids") {
    Y.rand_seed(seed + method);
    let n = Y.rand_int(10, 20) * 2;
    let cost = Y.rand_elem(["i", "j", "1"]);
    if (gen) Y.set_blank(name, ["n", "cost"], [n, "$ " + cost]);
    else {
        if (cost == "j") Y.grade_scalar(name, n);
        else if (cost == "i") Y.grade_scalar(name, n);
        else Y.grade_scalar(name, n);
    }
}

/**
 * Fall 2017 Midterm Q4, Fall 2017 Midterm Q5, Fall 2016 Final Q1, Fall 2006 Midterm Q6
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_stack_space(gen = false, name = "", seed = "rand", nc = 5) {
    Y.rand_seed(seed);
    let b = Y.rand_int(3, 6);
    let D = Y.rand_int(7, 10);
    let d = Y.rand_int(3, 6);
    let complex = Y.rand_elem(["stack space", "time"]);
    let method = Y.rand_elem(["BFS", "DFS", "IDS"]);
    let s = 0;
    if (complex == "time") {
        if (method == "BFS") {
            for (let i = 0; i <= d; i++) s += Math.pow(b, i);
        }
        else if (method == "DFS") {
            for (let i = D - d + 1; i <= D; i++) s += Math.pow(b, i);
            s++;
        }
        else if (method == "IDS") {
            for (let i = 0; i <= d; i++) s += (d + 1 - i) * Math.pow(b, i);
        }
    } else if (complex == "stack space") {
        if (method == "BFS") s = Math.pow(b, d);
        else if (method == "DFS") s = (b - 1) * D + 1;
        else if (method == "IDS") s = (b - 1) * d + 1;
    }
    let choices = Y.rand_unique_int_vec(0, 2 * s, nc);
    if (gen) {
        Y.set_blank(name, ["b", "D", "d"], [b, D, d]);
        Y.set_blank(name, ["complex", "method"], [complex, method]);
        Y.set_choices(name, choices);
    }
    else {
        let ans = choices.map(c => c >= s);
        Y.grade_choices(name, ans);
    }
}

/**
 * Fall 2017 Final Q24, Fall 2016 Midterm Q2
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_dead_end_search(gen = false, name = "", seed = "rand", method = "ids") {
    Y.rand_seed(seed);
    let n = Y.rand_int(20, 30);
    if (gen) Y.set_blank(name, ["n"], [n]);
    else {
        if (method == "bfs") Y.grade_scalar(name, 2 * n - 1);
        else if (method == "ids") Y.grade_scalar(name, n * n);
    }
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_large_tree_search(gen = false, name = "", seed = "rand", method = "bfs") {
    Y.rand_seed(seed);
    let one = 1;
    let p = Y.rand_int(6, 10);
    let diff = Y.rand_int(-1, 1);
    let n = Math.pow(2, p) + diff;
    if (gen) Y.set_blank(name, ["one", "n", "init", "goal"], [one, n, one, n]);
    else {
        if (method == "bfs") Y.grade_scalar(name, n);
        else {
            if (diff == -1) Y.grade_scalar(name, n);
            else Y.grade_scalar(name, p + diff + 1);
        }
    }
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_quick_tree(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let n = Y.rand_int(100, 200);
    if (gen) Y.set_blank(name, ["n"], [n]);
    else Y.grade_scalar(name, n + 1);
}

/**
 * Fall 2017 Midterm Q13
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_bfs_possible(gen = false, name = "", seed = "rand", nc = 5, nd = 9) {
    Y.rand_seed(seed);
    let order = [];
    for (let i = 0; i < nc; i++) {
        let nodes = Y.rand_unique_int_vec(0, nd - 1, 2);
        order.push([Math.max(...nodes), Math.min(...nodes)]);
    }
    let choices = order.map(o => o[0] + " before " + o[1]);
    let tree = Y.rand_tree(nd);
    if (gen) {
        let objects = Y.mat_to_digraph(tree);
        Y.scale_bounding_box_to_canvas(objects, "canvas_" + name);
        Y.two_paint("canvas_" + name, objects);
        Y.set_choices(name, choices);
    }
    else Y.grade_choices(name, order.map(o => Y.is_parent(o[0], o[1], tree)));
}
//#endregion

//#region Informed Search
/**
 * Fall 2018 Midterm Q5, Fall 2006 Final Q3, Fall 2006 Midterm Q7, Fall 2005 Final Q3, Fall 2005 Midterm Q2
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_hh_admissible(gen = false, name = "", seed = "rand", nc = 5) {
    Y.rand_seed(seed);
    let list = [];
    list.push({ h: "$ h_3(n) == max(h_1(n), h_2(n))", f: (x, y) => Math.max(x, y) });
    list.push({ h: "$ h_3(n) == min(h_1(n), h_2(n))", f: (x, y) => Math.min(x, y) });
    list.push({ h: "$ h_3(n) == h_1(n) + h_2(n)", f: (x, y) => x + y });
    list.push({ h: "$ h_3(n) == h_1(n)", f: (x, y) => x + 0 * y });
    list.push({ h: "$ h_3(n) == h_2(n)", f: (x, y) => 0 * x + y });
    list.push({ h: "$ h_3(n) == 1/2 h_1(n) + 1/2 h_2(n)", f: (x, y) => 0.5 * x + 0.5 * y });
    list.push({ h: "$ h_3(n) == h_1(n) - h_2(n)", f: (x, y) => x - y });
    list.push({ h: "$ h_3(n) == sqrt(h_1(n) + h_2(n))", f: (x, y) => Math.sqrt(x + y) });
    list.push({ h: "$ h_3(n) == sqrt(abs(h_1(n) - h_2(n)))", f: (x, y) => Math.sqrt(Math.abs(x - y)) });
    let choices = Y.rand_subset(list, nc);
    if (gen) Y.set_choices(name, choices.map(v => v.h));
    else {
        let check_fhh_admissible = function (f = function (x, y) { return 0; }) {
            let test = [[0, 0], [1, 1], [0, 1], [1, 0], [0.5, 0.5], [0.5, 0], [0, 0.5], [2, 2], [2, 0], [0, 2]];
            let fx = 0;
            for (let t of test) {
                fx = f(t[0], t[1]);
                if (fx < 0 || fx > Math.max(t[0], t[1])) return false;
            }
            return true;
        };
        let ans = choices.map(c => check_fhh_admissible(c.f));
        Y.grade_choices(name, ans);
    }
}

/**
 * Fall 2018 Midterm Q6, Fall 2017 Midterm Q10
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_h_admissible(gen = false, name = "", seed = "rand", nc = 5, always = true) {
    Y.rand_seed(seed);
    let list = [];
    list.push({ h: "$ h(n) == h_1(n) + 1", f: x => x + 1 });
    list.push({ h: "$ h(n) == h_1(n) - 1", f: x => x - 1 });
    list.push({ h: "$ h(n) == h_1(n) + 2", f: x => x + 1 });
    list.push({ h: "$ h(n) == h_1(n) - 2", f: x => x - 1 });
    list.push({ h: "$ h(n) == h_1(n) * 2", f: x => x * 2 });
    list.push({ h: "$ h(n) == h_1(n) / 2", f: x => x / 2 });
    list.push({ h: "$ h(n) == h_1(n) * 4", f: x => x * 4 });
    list.push({ h: "$ h(n) == h_1(n) / 4", f: x => x / 4 });
    list.push({ h: "$ h(n) == sqrt(h_1(n))", f: x => Math.sqrt(x) });
    list.push({ h: "$ h(n) == e^(h_1(n))", f: x => Math.exp(x) });
    list.push({ h: "$ h(n) == h_1(n)^2", f: x => x * x });
    list.push({ h: "$ h(n) == h_1(n)^3", f: x => x * x * x });
    list.push({ h: "$ h(n) == min(h_1(n), 0)", f: x => Math.min(x, 0) });
    list.push({ h: "$ h(n) == max(h_1(n), 0)", f: x => Math.max(x, 0) });
    let choices = Y.rand_subset(list, nc);
    if (gen) {
        Y.set_blank(name, "never", (always ? "always" : "never"));
        Y.set_choices(name, choices.map(v => v.h));
    }
    else {
        let check_fh_admissible = function (f = function (x) { return 0; }, always = true) {
            if (always) {
                let test = [0, 0.5, 1, 2];
                let fx = 0;
                for (let t of test) {
                    fx = f(t);
                    if (fx < 0 || fx > t) return false;
                }
                return true;
            }
            else {
                if (f(0) == 0) return false;
                else return true;
            }
        };
        let ans = choices.map(c => check_fh_admissible(c.f, always));
        Y.grade_choices(name, ans);
    }
}

/**
 * Fall 2018 Midterm Q6, Fall 2017 Midterm Q10
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_h_admissible_list(gen = false, name = "", seed = "rand", nc = 6, always = true) {
    Y.rand_seed(seed);
    let list = [];
    list.push({ h: "$ h(n) == h_1(n) + 1", f: x => x + 1 });
    list.push({ h: "$ h(n) == h_1(n) - 1", f: x => x - 1 });
    list.push({ h: "$ h(n) == h_1(n) + 2", f: x => x + 1 });
    list.push({ h: "$ h(n) == h_1(n) - 2", f: x => x - 1 });
    list.push({ h: "$ h(n) == h_1(n) * 2", f: x => x * 2 });
    list.push({ h: "$ h(n) == h_1(n) / 2", f: x => x / 2 });
    list.push({ h: "$ h(n) == h_1(n) * 4", f: x => x * 4 });
    list.push({ h: "$ h(n) == h_1(n) / 4", f: x => x / 4 });
    list.push({ h: "$ h(n) == sqrt(h_1(n))", f: x => Math.sqrt(x) });
    list.push({ h: "$ h(n) == e^(h_1(n))", f: x => Math.exp(x) });
    list.push({ h: "$ h(n) == h_1(n)^2", f: x => x * x });
    list.push({ h: "$ h(n) == h_1(n)^3", f: x => x * x * x });
    list.push({ h: "$ h(n) == min(h_1(n), 0)", f: x => Math.min(x, 0) });
    list.push({ h: "$ h(n) == max(h_1(n), 0)", f: x => Math.max(x, 0) });
    let choices = Y.rand_subset(list, nc);
    if (gen) Y.set_choices(name, choices.map(v => v.h));
    else {
        let check_fh_admissible = function (f = function (x) { return 0; }, always = true) {
            if (always) {
                let test = [0, 0.5, 1, 2];
                let fx = 0;
                for (let t of test) {
                    fx = f(t);
                    if (fx < 0 || fx > t) return false;
                }
                return true;
            }
            else {
                if (f(0) == 0) return false;
                else return true;
            }
        };
        let ans = choices.map(c => check_fh_admissible(c.f, always));
        Y.grade_vector(name, Y.get_index(ans, true, [-1], 1));
    }
}
//#endregion

//#region Hill Climbing
/**
 * Fall 2017 Midterm Q9
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_hill_global(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let a = Y.rand_int_not(-10, 10, 0);
    let b = Y.rand_int_not(-10, 10, 0);
    let bound = Y.rand_int(5, 10, 2);
    let score = Y.lin_eq_to_str([a, b], ["i", "j"]);
    let x = [Y.rand_int(-bound[0], bound[0]), Y.rand_int(-bound[1], bound[1])];
    if (gen) Y.set_blank(name, ["score", "init", "cons1", "cons2"], ["$ " + score, "$ " + Y.vec_to_str(x), "$ -" + bound[0] + " <= i <= " + bound[0], "$ -" + bound[1] + " <= j <= " + bound[1]]);
    else Y.grade_vector(name, [(a < 0 ? 1 : -1) * bound[0], (b < 0 ? 1 : -1) * bound[1]]);
}

/**
 * Fall 2017 Midterm Q9
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_hill_linear(gen = false, name = "", seed = "rand", nd = 3) {
    Y.rand_seed(seed);
    let abc = Y.rand_int_not(-10, 10, 0, nd);
    let bound = Y.rand_int(5, 10, nd);
    let names = ["i", "j", "k", "l", "m", "n"];
    let score = Y.lin_eq_to_str(abc, names.slice(0, nd));
    let x = Y.zero_vec(nd, 0);
    if (gen) {
        Y.set_blank(name, ["score", "init"], ["$ " + score, "$ [" + Y.vec_to_str(x) + "]"]);
        Y.set_blank(name, Y.str_seq(1, nd, 1, "cons"), bound.map((bi, i) => "$ -" + bi + " <= " + names[i] + " <= " + bi));
    }
    else Y.grade_vector(name, bound.map((bi, i) => (abc[i] < 0 ? 1 : -1) * bi));
}

/**
 * Fall 2016 Midterm Q6
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_hill_random(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let n = Y.rand_int(10, 20);
    let m = Y.rand_int(1, 5);
    let t = Y.rand_int(5, 10);
    if (gen) Y.set_blank(name, ["n", "nb", "T"], [n, m, t]);
    else {
        let ans = 1 - Math.pow((1 - m / n), t);
        Y.grade_scalar(name, ans);
    }
}

/**
 * Spring 2019 Midterm Q10, Fall 2017 Midterm Q8
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_local_1d_search(gen = false, name = "", seed = "rand", max = false, count = false) {
    Y.rand_seed(seed);
    let list = [{ f: "(-1)^i / i", g: i => Math.pow(-1, i) / i },
    { f: "(-1)^i / (i^2)", g: i => Math.pow(-1, i) / i / i },
    { f: "cos(i * pi) / (i^2)", g: i => Math.cos(i * Math.PI) / i / i },
    { f: "cos(i * pi) / i", g: i => Math.cos(i * Math.PI) / i },
    { f: "(-1)^i * i", g: i => Math.pow(-1, i) * i },
    { f: "(-1)^i * (i^2)", g: i => Math.pow(-1, i) * i * i },
    { f: "cos(i * pi) * (i^2)", g: i => Math.cos(i * Math.PI) * i * i },
    { f: "cos(i * pi) * i", g: i => Math.cos(i * Math.PI) * i }];
    let fun = Y.rand_elem(list);
    let bound = Y.rand_int(10, 15) * 10;
    if (gen) Y.set_blank(name, ["score", "bound"], ["$ " + fun.f, bound]);
    else {
        let x = Y.seq(1, bound, 1);
        let y = x.map(fun.g);
        let i = max ? Y.arg_max(y) : Y.arg_min(y);
        let left = i;
        while (left > 0 && ((max && y[left - 1] <= y[left]) || (!max && y[left - 1] >= y[left]))) left--;
        let right = i;
        while (right < y.length && ((max && y[right + 1] <= y[right]) || (!max && y[right + 1] >= y[right]))) right++;
        let ans = Y.get_ans(name);
        if (count && !ans.includes(",")) Y.grade_scalar(name, right - left + 1);
        else Y.grade_vector(name, Y.seq(x[left], x[right], 1));
    }
}
//#endregion

//#region Simulated Annealing
/**
 * Fall 2018 Midterm Q10
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_annealing_t(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let fs = Y.rand_int(0, 10);
    let ft = fs + Y.rand_int(0, 10);
    let p = Y.round(Y.rand(0, 1), 2);
    while (ft == fs) ft = fs + Y.rand_int(0, 10);
    if (gen) Y.set_blank(name, ["fs", "ft", "p"], [fs, ft, p]);
    else Y.grade_scalar(name, -Math.abs(fs - ft) / Math.log(p));
}

/**
 * Fall 2017 Midterm Q11
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_annealing_p(gen = false, name = "", seed = "rand", stay = false) {
    Y.rand_seed(seed);
    let fs = Y.rand_int(0, 10);
    let ft = Y.rand_int(0, 10);
    while (fs == ft) ft = Y.rand_int(0, 10);
    let T = Y.rand_int(2, 10);
    if (gen) Y.set_blank(name, ["fs", "ft", "T"], [fs, ft, T]);
    else {
        let prob = fs > ft ? 0.99999999 : Math.exp(- Math.abs(fs - ft) / T);
        Y.grade_scalar(name, stay ? 1 - prob : prob);
    }
}

/**
 * Spring 2017 Midterm Q2
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_genetic_cross(gen = false, name = "", seed = "rand", nd = 6, ns = 4) {
    Y.rand_seed(seed);
    let seq = Y.rand_int(1, 9, ns, nd);
    let fit = Y.rand_int(-1, 1, nd);
    let d = Y.rand_int(1, nd - 1);
    while (Math.max(...fit) == 0 && Math.min(...fit) == 0) fit = Y.rand_int(-1, 1, nd);
    if (gen) {
        Y.set_blank(name, ["n", "fit", "d1", "d2", "ex"], [nd, "$ " + Y.lin_eq_to_str(fit, Y.str_seq(1, nd, 1, " d[", "]")), d, d + 1, "$ [[" + Y.str_seq(1, nd, 1, " d[", "]") + "]]"]);
        Y.set_blank(name, Y.str_seq(1, ns, 1, "s"), seq.map(si => "$ [" + Y.vec_to_str(si) + "]"));
    }
    else {
        let f = seq.map(si => Y.vec_dot(si, fit));
        let best = Y.arg_sort(f, false);
        let cr = Y.genetic_cross(seq[best[0]], seq[best[1]], d - 1);
        Y.grade_matrix_as_scalar(name, cr);
    }
}
//#endregion

//#region Alpha Beta
/**
 * Fall 2018 Midterm Q7, Fall 2013 Final Q16
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_alpha_beta_range(gen = false, name = "", seed = "rand", nc = 5, extra = [0, 2], max = true, choice = true) {
    Y.rand_seed(seed);
    //let left = rand_int(0, 99, extra[0]);
    let right = Y.rand_int(0, 50, extra[1]);
    let threshold = max ? Math.min(...right) : Math.max(...right);
    let choices = Y.rand_unique_int_vec(threshold - 50, threshold + 50, nc);
    if (gen) {
        let names = [];
        if (max) names = ["max", "A", "min"];
        else names = ["min", "A", "max"];
        let rights = right.map(c => String(c));
        names.push(...rights);
        names.push("B");
        let n = names.length;
        let graph = Y.zero_mat(n, n);
        graph[0][1] = 1;
        graph[0][2] = 1;
        for (let i = 3; i < n; i++) graph[2][i] = 1;
        let g = Y.mat_to_tree(graph, 0, names);
        Y.scale_bounding_box_to_canvas(g, "canvas_" + name);
        Y.two_paint("canvas_" + name, g);
        if (choice) Y.set_choices(name, choices);
    }
    else {
        if (choice) {
            let ans = choices.map(c => max ? c >= threshold : c <= threshold);
            Y.grade_choices(name, ans);
        }
        else Y.grade_scalar(name, threshold);
    }
}

/**
 * Fall 2017 Midterm Q12, Fall 2016 Midterm Q8, Fall 2014 Final Q13, Fall 2012 Final Q17, Fall 2008 Midterm Q5, Fall 2005 Midterm Q14
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_alpha_beta(gen = false, name = "", seed = "rand", node = [3, 3], max = true) {
    Y.rand_seed(seed);
    let payoff = node.map(ni => Y.rand_int(-10, 10, ni));
    let threshold = 0;
    if (max) {
        threshold = Math.min(...payoff[0]);
        payoff[1][Y.rand_int(0, node[1] - 2)] = threshold - Y.rand_int(1, 5);
    }
    else {
        threshold = Math.max(...payoff[0]);
        payoff[1][Y.rand_int(0, node[1] - 2)] = threshold + Y.rand_int(1, 5);
    }
    if (gen) {
        let names = [];
        if (max) names = ["max", "min", "min"];
        else names = ["min", "max", "max"];
        let lefts = payoff[0].map(c => String(c));
        let rights = payoff[1].map(c => String(c));
        names.push(...lefts);
        names.push(...rights);
        let n = names.length;
        let graph = Y.zero_mat(n, n);
        graph[0][1] = 1;
        graph[0][2] = 1;
        for (let i = 3; i < 3 + node[0]; i++) graph[1][i] = 1;
        for (let i = 3 + node[0]; i < 3 + node[0] + node[1]; i++) graph[2][i] = 1;
        let g = Y.mat_to_tree(graph, 0, names);
        Y.scale_bounding_box_to_canvas(g, "canvas_" + name);
        Y.two_paint("canvas_" + name, g);
        Y.set_state("select", "canvas_" + name);
        Y.set_blank(name, "first", max ? "max" : "min");
    }
    else {
        let selected = Y.get_ans_selected(name);
        let ans = Y.get_ans_graph(name, true);
        let pruned = [];
        for (let i = 0; i < node[1]; i++) {
            if ((max && payoff[1][i] <= threshold) || (!max && payoff[1][i] >= threshold)) {
                pruned = payoff[1].slice(i + 1);
                break;
            }
        }
        Y.set_ans(Y.mat_to_str_line(ans), name);
        let check = Y.vec_equal(selected, pruned);
        if (check) Y.grade_binary(name, 1);
        else Y.grade_binary(name, 0);
    }
}

/**
 * Fall 2018 Midterm Q8, Fall 2013 Final Q13
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_game_tree_value(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let pile = Y.rand_int(2, 3);
    let sticks = Y.rand_int(1, 3, pile);
    if (gen) {
        Y.set_blank(name, ["pile", "sticks"], [pile, Y.vec_to_str(sticks)]);
    }
    else {
        let graph = Y.get_ans_graph(name);
        let ans = Y.reorder_graph(graph, [], []);
        Y.set_ans(ans, name);
        Y.grade_scalar(name, 0); // TODO
    }
}

/**
 * Fall 2017 Midterm Q3, Fall 2010 Final Q6
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_flip_game(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let bits = Y.rand_int(2, 4);
    let init = Y.rep("0", bits);
    let final = Y.rep("1", bits);
    let dollar = Y.rand_int(bits * 2 + 1, bits * 2 + 5);
    if (gen) Y.set_blank(name, ["bits", "init", "final", "dollar"], [bits, init, final, dollar]);
    else Y.grade_scalar(name, dollar - bits);
}

/**
 * Fall 2008 Midterm Q5
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_reorder_prune(gen = false, name = "", seed = "rand", branch = [3, 3], max = true) {
    Y.rand_seed(seed);
    let v = Y.rand_int(-10, 10, branch[0] * branch[1]);
    if (gen) {
        let graph = Y.complete_binary_tree_mat(2, branch[0]);
        let names = max ? ["max", ...Y.rep("min", branch[0])] : ["min", ...Y.rep("max", branch[0])];
        names.push(...v);
        let g = Y.mat_to_tree(graph, 0, names);
        Y.scale_bounding_box_to_canvas(g, "canvas_" + name);
        Y.two_paint("canvas_" + name, g);
        Y.set_state("move", "canvas_" + name);
    }
    else {
        let mat = Y.reshape(v, branch[0], branch[1]);
        let v1 = max ? Y.mat_min_by_row(mat) : Y.mat_max_by_row(mat);
        let v0 = max ? Math.max(...v1) : Math.min(...v1);
        let total = 0;
        let current = 0;
        for (let i = 0; i < branch[0]; i++) {
            if (v1[i] != v0) {
                for (let j = 0; j < branch[1]; j++) {
                    if (max ? v[i][j] <= v0 : v[i][j] >= v0) {
                        total++;
                        current = 1;
                    }
                }
                if (current == 1) {
                    total--;
                    current = 0;
                }
            }
        }
        total = Y.get_num(Y.get_ans(name));
        if (total <= 4 && total >= 0) Y.grade_scalar(name, total);
        else Y.grade_binary(name);
    }
}

/**
 * Fall 2006 Final Q5, Fall 2005 Final Q5, Fall 2005 Midterm Q7
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_chance_game(gen = false, name = "", seed = "rand", max = true) {
    Y.rand_seed(seed);
    let v = Y.rand_int(-10, 10, 8);
    let ps = Y.round_vec(Y.rand(0, 1, 2), 2);
    if (gen) {
        let graph = Y.complete_binary_tree_mat(3, 2);
        let names = max ? ["max", "chn", "chn", "min", "min", "min", "min"] : ["min", "chn", "chn", "max", "max", "max", "max"];
        names.push(...v);
        let labels = Y.zero_mat(graph.length, graph.length, "");
        labels[1][3] = ps[0];
        labels[1][4] = Y.round(1 - ps[0], 2);
        labels[2][5] = ps[1];
        labels[2][6] = Y.round(1 - ps[1], 2);
        let g = Y.mat_to_tree(graph, 0, names, labels);
        Y.scale_bounding_box_to_canvas(g, "canvas_" + name);
        Y.two_paint("canvas_" + name, g);
        Y.set_state("move", "canvas_" + name);
    }
    else {
        let top = max ? Math.max : Math.min;
        let bottom = max ? Math.min : Math.max;
        let v2 = [bottom(v[0], v[1]), bottom(v[2], v[3]), bottom(v[4], v[5]), bottom(v[6], v[7])];
        let v1 = [ps[0] * v2[0] + (1 - ps[0]) * v2[1], ps[1] * v2[2] + (1 - ps[1]) * v2[3]];
        let v0 = top(v1[0], v1[1]);
        Y.grade_scalar(name, v0);
    }
}

/**
 * Fall 2013 Final Q20, Fall 2010 Midterm Q4
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_switch_on_off(gen = false, name = "", seed = "rand", right = true) {
    Y.rand_seed(seed);
    let n = Y.rand_int(4, 6) * 2;
    let spots = Y.rand_unique_int_vec(0, n - 2, n / 2);
    let initial = Y.zero_vec(n).map((_, i) => spots.includes(i) ? 1 : 0);
    let goal = right ? [...Y.rep(0, n / 2), ...Y.rep(1, n / 2)] : [...Y.rep(1, n / 2), ...Y.rep(0, n / 2)];
    if (gen) Y.set_blank(name, ["n", "initial", "goal"], [n, "$ [" + Y.vec_to_str(initial) + "]", "$ [" + Y.vec_to_str(goal) + "]"]);
    else {
        let total = 0;
        let ii = 0;
        let ij = 0;
        let n = Y.vec_sum(goal);
        for (let i = 0; i < n; i++) {
            while (ii < goal.length) {
                if (initial[ii] == 0) ii++;
                else break;
            }
            while (ij < goal.length) {
                if (goal[ij] == 0) ij++;
                else break;
            }
            total += Math.abs(ii - ij);
            ii++;
            ij++;
        }
        Y.grade_scalar(name, total);
    }
}

/**
 * Fall 2017 Final Q6
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_nim(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let pile = Y.rand_int(3, 6);
    if (gen) Y.set_blank(name, "pile", pile);
    else Y.grade_scalar(name, (pile % 2 ? 1 : -1));
}
//#endregion

//#region Game Theory
/**
 * Fall 2016 Midterm Q9
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_count_pure(gen = false, name = "", seed = "rand", n1 = 3, n2 = 6) {
    Y.rand_seed(seed);
    let n = Y.rand_int(2, 4);
    if (gen) Y.set_blank(name, [], []);
    else Y.grade_scalar(name, 0); // TODO
}

/**
 * Fall 2014 Final Q4, Fall 2006 Midterm Q9
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the 
 */
export function q_mixed_br(gen = false, name = "", seed = "rand", actions = [3, 3], player = 0) {
    Y.rand_seed(seed);
    let payoff = Y.rand_int(-1, 1, actions[0], actions[1]);
    let mixed = Y.rand_int(1, 4, actions[player]);
    let demon = Y.vec_sum(mixed);
    if (gen) {
        Y.set_blank(name, "mix", "$ " + Y.frac_to_str(mixed, demon));
        Y.set_blank(name, Y.flatten(Y.str_double_seq(1, actions[0], 1, 1, actions[1], 1, "mat")), Y.flatten(payoff));
    }
    else {
        if (player == 0) Y.grade_scalar(name, Math.max(...Y.mat_dot_vec_row(payoff, Y.vec_mul(mixed, 1 / demon))));
        else Y.grade_scalar(name, Math.max(...Y.mat_dot_vec_col(payoff, Y.vec_mul(mixed, 1 / demon))));
    }
}

/**
 * Fall 2014 Final Q5, Fall 2006 Final Q4, Fall 2005 Final Q4, Fall 2005 Midterm Q11
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_zero_sum_nash(gen = false, name = "", seed = "rand", actions = [3, 3]) {
    Y.rand_seed(seed);
    let payoff = Y.rand_zero_sum_nash(-10, 10, actions[0], actions[1]);
    if (gen) Y.set_blank(name, Y.flatten(Y.str_double_seq(1, actions[0], 1, 1, actions[1], 1, "mat")), Y.flatten(payoff));
    else {
        let na = Y.flatten(Y.nash(Y.zero_sum_to_game(payoff)));
        Y.grade_choices(name, na.map(n => n == 1));
    }
}

/**
 * Fall 2012 Final Q18, Fall 2006 Midterm Q12
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_zero_sum_value(gen = false, name = "", seed = "rand", actions = [3, 3]) {
    Y.rand_seed(seed);
    let payoff = Y.rand_zero_sum_nash(-10, 10, actions[0], actions[1]);
    if (gen) Y.set_blank(name, Y.flatten(Y.str_double_seq(1, actions[0], 1, 1, actions[1], 1, "mat")), Y.flatten(payoff));
    else {
        let na = Y.nash(Y.zero_sum_to_game(payoff));
        let list = [];
        for (let i = 0; i < actions[0]; i++) {
            for (let j = 0; j < actions[0]; j++) {
                if (na[i][j]) list.push(payoff[i][j]);
            }
        }
        Y.grade_scalar(name, Math.max(...list));
    }
}

/**
* Fall 2012 Final Q18, Fall 2006 Final Q6, Fall 2005 Final Q6, Fall 2005 Midterm Q10
* @param {boolean} gen Whether to generate (true) or grade (false) the question
* @param {string} name Name of the question
* @param {string} seed Random seed corresponding to the ID
*/
export function q_ie_sds(gen = false, name = "", seed = "rand", actions = [3, 3]) {
    Y.rand_seed(seed);
    let initial = Y.rand_int(-10, 10, 2);
    let payoff = [[Y.vec_clone(initial)]];
    let add = Y.vec_sum(actions) - 2;
    for (let i = 0; i < add; i++) {
        let d = Y.get_dominated_actions(payoff, i % 2, 1, 5);
        if (i % 2 == 0) Y.insert_row(payoff, d, Y.rand_int(0, payoff.length));
        else Y.insert_col(payoff, d, Y.rand_int(0, payoff[0].length));
    }
    payoff = payoff.map(pi => pi.map(pij => pij[0] + ", " + pij[1]));
    if (gen) Y.set_blank(name, Y.flatten(Y.str_double_seq(1, actions[0], 1, 1, actions[1], 1, "mat")), Y.flatten(payoff));
    else Y.grade_vector(name, initial);
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_vaccine(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let n = Y.rand_int(10, 20) * 10;
    let alpha = Y.rand_int(15, 19);
    let beta = Y.rand_int(1, 9);
    let c = Y.rand_int(2, 5);
    if (gen) Y.set_blank(name, ["n", "alpha", "beta", "c"], [n, alpha, beta, c]);
    else Y.grade_scalar(name, Math.floor((c - beta / n) / (alpha - beta) * n));
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_max_mix(gen = false, name = "", seed = "rand", row = true) {
    Y.rand_seed(seed);
    let r = Y.rand_int(1, 6);
    let j = Y.rand_int_not(1, 6, r);
    if (gen) Y.set_blank(name, ["bb", "bs", "sb", "ss"], [r + ", " + j, "0, 0", "0, 0", j + ", " + r]);
    else {
        let p = r / (r + j);
        let q = j / (r + j);
        Y.grade_scalar(name, row ? p * q * r + (1 - p) * (1 - q) * j : p * q * j + (1 - p) * (1 - q) * r);
    }
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_highway(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let c = Y.rand_int(10, 20);
    let n = c * Y.rand_int(10, 20);
    if (gen) Y.set_blank(name, ["n", "c"], [n, c]);
    else Y.grade_scalar(name, n - c);
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_crime_report(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let n = Y.rand_int(5, 10);
    let b = Y.rand_int(4, 6);
    let c = Y.rand_int(1, 3);
    if (gen) Y.set_blank(name, ["n", "b", "c"], [n, b, c]);
    else {
        let p = Math.pow(1 - (b - c) / b, 1 / (n - 1));
        Y.grade_scalar(name, Math.pow(p, n));
    }
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_cts_mix_game(gen = false, name = "", seed = "rand", row = true) {
    Y.rand_seed(seed);
    let t = Y.rand_int(2, 10);
    let r = Y.rand_int(2, 10);
    let j = Y.rand_int(2, 10);
    let pl = row ? 1 : 0;
    let dom = Y.rand_int(0, 1);
    let ran = Y.rand_int(0, 1, 3);
    let mat = Y.zero_mat(2, 2, 0);
    mat = mat.map(mi => mi.map(_ => [0, 0]));
    mat[dom][0][pl] = t;
    mat[dom][1][pl] = t;
    mat[1 - dom][ran[0]][pl] = t;
    mat[ran[1]][ran[2]][1 - pl] = r;
    mat[1 - ran[1]][1 - ran[2]][1 - pl] = j;
    if (gen) {
        Y.set_blank(name, ["ul", "ur", "dl", "dr"], [mat[0][0], mat[0][1], mat[1][0], mat[1][1]]);
        let objects = [];
        let ri = 10 * (mat[1][1][0] - mat[0][1][0]) / (mat[0][0][0] - mat[0][1][0] - mat[1][0][0] + mat[1][1][0]);
        let ci = 10 * (mat[1][1][1] - mat[1][0][1]) / (mat[0][0][1] - mat[1][0][1] - mat[0][1][1] + mat[1][1][1]);
        let rs = (mat[0][0][0] > mat[1][0][0] ? 9.9 : 0.1);
        let re = (mat[0][1][0] > mat[1][1][0] ? 9.9 : 0.1);
        let cs = (mat[0][0][1] > mat[0][1][1] ? 10.1 : -0.1);
        let ce = (mat[1][0][1] > mat[1][1][1] ? 10.1 : -0.1);
        objects.push({ type: "axis", x0: 0, x1: 10, y0: 0, y1: 0, ar: "->" });
        objects.push({ type: "axis", x0: 0, x1: 0, y0: 0, y1: 10, ar: "->" });
        objects.push({ type: "text", name: "L", x: 0, y: -0.5 });
        objects.push({ type: "text", name: "R", x: 10, y: -0.5 });
        objects.push({ type: "text", name: "D", x: -0.5, y: 0 });
        objects.push({ type: "text", name: "U", x: -0.5, y: 10 });
        objects.push({ type: "line", x0: ri, x1: ri, y0: 0, y1: 10, c0: "blue", t0: 5 });
        objects.push({ type: "line", x0: 0, x1: ri, y0: rs, y1: rs, c0: "blue", t0: 5 });
        objects.push({ type: "line", x0: ri, x1: 10, y0: re, y1: re, c0: "blue", t0: 5 });
        objects.push({ type: "line", x0: 0, x1: 10, y0: ci, y1: ci, c0: "red", t0: 5 });
        objects.push({ type: "line", x0: cs, x1: cs, y0: 0, y1: ci, c0: "red", t0: 5 });
        objects.push({ type: "line", x0: ce, x1: ce, y0: ci, y1: 10, c0: "red", t0: 5 });
        Y.scale_bounding_box_to_canvas(objects, "canvas_" + name);
        Y.two_paint("canvas_" + name, objects);
    }
    else {
        let cut = ran[1] == 0 ? j / (j + r) : r / (j + r);
        let ans = [0.00001, 0.99999];
        if (ran[1] == 0 && ran[2] == ran[0]) ans[0] = cut;
        else ans[1] = cut;
        Y.grade_vector(name, ans);
    }
}

/**
 * Fall 2005 Final Q20
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_pd_game(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let slack = Y.rand_int(3, 6);
    let work = Y.rand_int(7, 10) * 2;
    let no_bonus = Y.rand_int(1, 4) * 2;
    let bad_bonus = (work + no_bonus) / 2;
    if (gen) Y.set_blank(name, ["s", "b10", "b01", "b00"], [slack, work + ", " + no_bonus, no_bonus + ", " + work, bad_bonus + ", " + bad_bonus]);
    else Y.grade_scalar(name, no_bonus + slack);
}

/**
 * New Question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_donate_game(gen = false, name = "", seed = "rand") {
    if (!gen) {
        let ans = Y.get_num(Y.get_ans(name), 0);
        if (ans < 0.5) Y.grade_scalar(name, ans);
        else Y.grade_binary(name);
    }
}
//#endregion

//#region Programming 1
/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_mn_ist(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let d = Y.rand_unique_int_vec(0, 9, 2);
    let d1 = get_mn_ist(d[0]);
    let d2 = get_mn_ist(d[1]);
    if (gen) {
        let s = Y.mat_to_str(d1, 0, "\n", ",", "", "", "", "") + "\n" + Y.mat_to_str(d2, 0, "\n", ",", "", "", "", "");
        Y.set_blank(name, ["d1", "d2", "test"], [d[0], d[1], s]);
        let cnn = Y.get_elem("canvas_nn");
        if (cnn) {
            let objects = [{ type: "grid", cts: false, fill: ["white", "black"], stroke: "black", mat: Y.zero_mat(28, 28), x0: 0, y0: 0, x1: 1, y1: 1, dx0: 0, dy0: 0 }];
            Y.scale_bounding_box_to_canvas(objects, "canvas_nn", 0);
            Y.two_paint("canvas_nn", objects);
            Y.set_state("select_3", "canvas_nn");
        }
        let clog = Y.get_elem("canvas_log");
        if (clog) {
            let objects = [{ type: "grid", cts: false, fill: ["white", "black"], stroke: "black", mat: Y.zero_mat(28, 28), x0: 0, y0: 0, x1: 1, y1: 1, dx0: 0, dy0: 0 }];
            Y.scale_bounding_box_to_canvas(objects, "canvas_log", 0);
            Y.two_paint("canvas_log", objects);
            Y.set_state("select_3", "canvas_log");
        }
    }
}

export function get_mn_ist(d = 0) {
    if (d == 0) return d0;
    else if (d == 1) return d1;
    else if (d == 2) return d2;
    else if (d == 3) return d3;
    else if (d == 4) return d4;
    else if (d == 5) return d5;
    else if (d == 6) return d6;
    else if (d == 7) return d7;
    else if (d == 8) return d8;
    else if (d == 9) return d9;
    else return d0;
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_check_vec_dim(gen = false, name = "", seed = "rand", field = "", n = 1) {
    Y.rand_seed(seed);
    if (!gen) {
        let ans = Y.get_str(field, "", true);
        let mat = Y.str_to_vec(ans, false);
        Y.set_ans("" + mat.length, name);
        if (mat.length == n) Y.grade_binary(name, 1);
        else Y.grade_binary(name, 0, -1, Y.incorrect_size_message(Y.n_row(mat), n));
    }
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_check_vec_dim_larger(gen = false, name = "", seed = "rand", field = "", n = 1) {
    if (!gen) {
        let ans = Y.get_str(field, "", true);
        let mat = Y.str_to_vec(ans, false);
        Y.set_ans("" + mat.length, name);
        if (mat.length >= n) Y.grade_binary(name, 1);
        else Y.grade_binary(name, 0, -1, Y.incorrect_size_message(Y.n_row(mat), n, -1, -1, true));
    }
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_check_mat_dim(gen = false, name = "", seed = "rand", field = "", n = 1, m = 1) {
    if (!gen) {
        let ans = Y.get_str(field, "", true);
        let mat = Y.str_to_mat_line(ans, false);
        Y.set_ans("" + mat.length + "," + mat[0].length, name);
        let c = Y.n_col(mat);
        if (mat.length == n && c == m) Y.grade_binary(name, 1);
        else Y.grade_binary(name, 0, -1, Y.incorrect_size_message(Y.n_row(mat), n, c, m));
    }
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_check_mat_dim_larger(gen = false, name = "", seed = "rand", field = "", n = 1, m = 1) {
    if (!gen) {
        let ans = Y.get_str(field, "", true);
        let mat = Y.str_to_mat_line(ans, false);
        Y.set_ans("" + mat.length + "," + mat[0].length, name);
        let c = Y.n_col(mat);
        if (mat.length >= n && c >= m) Y.grade_binary(name, 1);
        else Y.grade_binary(name, 0, -1, Y.incorrect_size_message(Y.n_row(mat), n, c, m, true));
    }
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_log_act(gen = false, name = "", seed = "rand", act = "log_act", test = "test", weights = "log_weights") {
    if (!gen) {
        let x = Y.str_to_mat_line(Y.get_str(test, "", true), false);
        let y = Y.str_to_vec(Y.get_str(act, "", true), false);
        if (x.length < 2 || y.length != x.length) {
            Y.set_ans(0, name);
            Y.grade_binary(name, 0, -1, Y.incorrect_size_message(y.length, Math.max(x.length, 2)));
        }
        else {
            x = Y.scale_mat_by_col(x, [0, 255], [0, 1]);
            let w = Y.str_to_vec(Y.get_str(weights, "", true), false);
            let c = Y.activate_vec(x, { w: w }, Y.activate_logistic);
            let count = Y.count_equal(y, c, 1);
            Y.set_ans(count, name);
            if (count > 0.9 * y.length) Y.grade_binary(name, 1);
            else Y.grade_binary(name, 0, -1, "Your accuracy " + (count / y.length).toFixed(2) + " is less than 90%.");
        }
    }
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_nn_act(gen = false, name = "", seed = "rand", act = "log_act", test = "test", in_weights = "in_weights", out_weights = "out_weights") {
    if (!gen) {
        let x = Y.str_to_mat_line(Y.get_str(test, "", true), false);
        let y = Y.str_to_vec(Y.get_str(act, "", true), false);
        if (x.length < 2 || y.length != x.length) {
            Y.set_ans(0, name);
            Y.grade_binary(name, 0, -1, Y.incorrect_size_message(x.length, Math.max(y.length, 2)));
        }
        else {
            x = Y.scale_mat_by_col(x, [0, 255], [0, 1]);
            let w1 = Y.str_to_mat_line(Y.get_str(in_weights, "", true), false);
            let w2 = Y.transpose(Y.str_to_vec(Y.get_str(out_weights, "", true), false));
            let c = Y.activate_vec(x, { w: [w1, w2] }, Y.activate_nn);
            let count = Y.count_equal(y, c, 1);
            Y.set_ans(count, name);
            if (count > 0.9 * y.length) Y.grade_binary(name, 1);
            else Y.grade_binary(name, 0, -1, "Only " + Math.floor(count / y.length * 100) + " percent of the activations are consistent with the weights entered in the previous questions.");
        }
    }
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_class_from_act(gen = false, name = "", seed = "rand", pred = "pred", act = "act", test = "test") {
    if (!gen) {
        let x = Y.str_to_mat_line(Y.get_str(test, "", true), false);
        let y = Y.str_to_vec(Y.get_str(pred, "", true), false);
        let a = Y.str_to_vec(Y.get_str(act, "", true), false);
        if (x.length < 2 || y.length != a.length || x.length != y.length) {
            Y.set_ans(0, name);
            Y.grade_binary(name, 0, -1, Y.incorrect_size_message(a.length, Math.max(y.length, 2)));
        }
        else {
            let c = Y.round_vec(a, 0);
            let count = Y.count_equal(y, c);
            Y.set_ans(count, name);
            if (count < 0.98 * y.length) Y.grade_binary(name, 0, -1, "Only " + Math.floor(count / y.length * 100) + " percent of the labels are consistent with the activations entered in the previous question.");
            else Y.grade_accuracy(name, y, [...Y.rep(0, c.length / 2), ...Y.rep(1, c.length / 2)]);
        }
    }
}
//#endregion

//#region Programming 2
/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_wisconsin(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let vr = Y.rand_int(2, 10);
    let vrs = Y.rand_unique_int_vec(2, 10, 6);
    let depth = Y.rand_int(6, 8);
    if (gen) {
        let s = [...w2, ...w4];
        let ex = "if (x" + vrs[0] + " <= 5)\n if (x" + vrs[1] + " <= 2) return 2\n else return 4\nelse\n if (x" + vrs[1] + " <= 8) return 4\n else return 2";
        Y.set_blank(name, ["var", "vars", "depth", "test", "example"], [vr, Y.vec_to_str(vrs, 0, ", ", "", ""), depth, Y.mat_to_str(s, 0, "\n", ",", "", "", "", ""), ex]);
    }
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_empty_vec(gen = false, name = "", seed = "rand", n = 2) {
    if (!gen) {
        let vec = Y.get_ans_vec(name);
        if (vec.length == n) Y.grade_binary(name, 1);
        else Y.grade_binary(name, 0, -1, Y.incorrect_size_message(Y.n_row(vec), n));
    }
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_tree_entropy(gen = false, name = "", seed = "rand", y_count = "", x_count = "") {
    if (!gen) {
        let y = Y.str_to_vec(Y.get_str(y_count, "", true));
        let ent_y = Y.entropy_count(y);
        if (x_count == "") Y.grade_scalar(name, ent_y, -1, "The entropy based on the answers from your previous questions should be: " + Y.round(ent_y, 4) + ".");
        else {
            let x = Y.str_to_vec(Y.get_str(x_count, "", true));
            let info_gain = Y.entropy_count(y) - Y.cond_entropy_count(y, x);
            Y.grade_scalar(name, info_gain, -1, "The information gain based on the answers from your previous questions should be: " + Y.round(info_gain, 4) + ".");
        }
    }
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_check_tree(gen = false, name = "", seed = "rand", tree = "tree", depth = false, max_depth = "", variables = "") {
    if (!gen) {
        let t = Y.get_str(tree, "", true);
        let d = Y.depth_of_list(t.split("\n"));
        Y.set_ans(d, name);
        if (d > 0) {
            if (!depth) {
                let md = (max_depth == "" ? d : Y.get_num(max_depth, 6, false, true));
                if (d > md) Y.grade_binary(name, 0, -1, "The depth is larger than the maximum depth limit of " + md + ": the depth of the tree you entered is " + d + ".");
                else if (variables != "") {
                    let vars = Y.get_str(variables, "", true);
                    let correct = Y.var_of_list(t.split("\n"), vars.split(","));
                    if (!correct) Y.grade_binary(name, 0, -1, "Incorrect variable names or used variables that are not in the list: " + vars);
                    else Y.grade_binary(name, 1);
                }
                else Y.grade_binary(name, 1);
            }
            else Y.grade_binary(name, 1);
        }
        else Y.grade_binary(name, 0, -1, "Incorrect tree format.");
    }
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_tree_act(gen = false, name = "", seed = "rand", label = "label", tree = "tree", data = "test_0") {
    if (!gen) {
        let x = Y.str_to_mat_line(Y.get_str(data, "", true));
        let y = Y.str_to_vec(Y.get_str(label, "", true), false);
        if (x.length < 2 || y.length != x.length) {
            Y.set_ans(0, name);
            Y.grade_binary(name, 0, -1, Y.incorrect_size_message(x.length, Math.max(y.length, 2)));
        }
        else {
            let t = Y.get_str(tree, "", true);
            let d_tree = Y.list_to_d_tree(t.split("\n"));
            let a = Y.activate_vec(x, { tree: d_tree }, Y.activate_d_tree);
            let count = Y.count_equal(y, a);
            Y.set_ans(count, name);
            if (count < 0.98 * y.length) Y.grade_binary(name, 0, -1, "Only " + Math.floor(count / y.length * 100) + " percent of the labels are consistent with the tree entered in the previous question.");
            else Y.grade_accuracy(name, y, [...Y.rep(2, a.length / 2), ...Y.rep(4, a.length / 2)]);
        }
    }
}
//#endregion

//#region Programming 3
/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_script(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let movies = ["Joker", "Avengers", "Coco", "Logan", "Room", "Interstellar", "The Wolf of Wall Street", "12 Years a Slave", "Rush", "Django Unchained", "The Dark Knight Rises", "Warrior", "The Help", "Harry Potter (any)", "Inception", "Toy Story", "How to Train Your Dragon", "Up", "Gran Torino", "The Dark Knight", "Wall-E", "No Country for Old Men", "Into the Wild", "The Prestige", "V for Vendetta", "The Departed", "Batman Begins", "Hotel Rwanda", "Eternal Sunshine of the Spotless Mind", "The Lord of the Rings (any)", "Kill Bill", "The Pianist", "Catch Me If You Can", "Memento", "Snatch", "Gladiator"];
    let index = Y.rand_unique_int_vec(0, movies.length - 1, 3);
    let letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    let uni_gram = [0.002648482, 0.015083211, 0.010219868, 0.005291359, 0.00201614, 0.010100606, 0.011168313, 0.003692837, 0.002982262, 0.147085948, 0.017418073, 0.005591093, 0.009353346, 0.003334442, 0.002997755, 0.011666226, 0.23688579, 0.002966146, 0.003556844, 0.002405317, 0.00815959, 0.023010378, 0.008790684, 0.150027667, 0.011285933, 0.292261689];
    let script = Y.rand_dist(uni_gram, letters, 10000);
    let prior = Y.round(Y.rand(0.55, 0.95), 2);
    Y.replace_elements(script, " ", 0.9, 1);
    if (gen) Y.set_blank(name, ["movie1", "movie2", "movie3", "script", "prior", "np"], [movies[index[0]], movies[index[1]], movies[index[2]], script.join(""), prior, (1 - prior).toFixed(2)]);
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_check_prob(gen = false, name = "", seed = "rand", prob = "gram", n = 27, m = 27, zero = false) {
    if (!gen) {
        let p = Y.str_to_mat_line(Y.get_str(prob, "", true));
        let row = Y.n_row(p);
        let col = Y.n_col(p);
        Y.set_ans(row + "," + col, name);
        if (p.length != n || col != m) Y.grade_binary(name, 0, -1, Y.incorrect_size_message(p.length, n, col, m));
        else {
            let sums = p.reduce((s, pi) => s && Y.close_to(Y.vec_sum(pi), 1, 2), true);
            if (!sums) Y.grade_binary(name, 0, -1, "The rows do not sum up to 1.");
            else {
                if (zero) {
                    let pos = p.reduce((s, pi) => s && Math.min(...pi) > 0, true);
                    if (pos) Y.grade_binary(name, 1);
                    else Y.grade_binary(name, 0, -1, "Laplace smoothing is done incorrectly.");
                }
                else if (n > 1 && p[0][0] != 0) Y.grade_binary(name, 0, -1, "There should not be consecutive spaces.");
                else Y.grade_binary(name, 1);
            }
        }
    }
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_check_mc(gen = false, name = "", seed = "rand", sentences = "sentences", prob = "gram", n = 26000) {
    if (!gen) {
        let script = Y.get_str(sentences, "", true);
        Y.set_ans(0, name);
        if (script.length < n) Y.grade_binary(name, 0, -1, Y.incorrect_size_message(script.length, n));
        else {
            let c = Y.count_char(script);
            let t = Y.vec_sum(c);
            let p = c.map(ci => ci / t);
            let uni = Y.str_to_vec(Y.get_str(prob, "", true));
            let close = Y.vec_close(p, uni, 1);
            if (close) Y.grade_binary(name, 1);
            else Y.grade_binary(name, 0, -1, "Probably inconsistent with the probabilities: please try generate the sentences again.");
        }
    }
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_check_uni(gen = false, name = "", seed = "rand", prob = "gram", test = "script_0") {
    if (!gen) {
        let uni = Y.str_to_vec(Y.get_str(prob, "", true));
        Y.set_ans(uni.length, name);
        if (uni.length != 27) Y.grade_binary(name, 0, -1, Y.incorrect_size_message(uni.length, 27));
        else {
            let script = Y.get_str(test, "", true);
            let code = Y.count_char(script);
            let total = Y.vec_sum(code);
            let y = code.map(c => c / total);
            let close = Y.vec_close(uni, y, 2);
            if (close) Y.grade_binary(name, 1);
            else Y.grade_binary(name, 0, -1, "Incorrect probabilities.");
        }
    }
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_check_post(gen = false, name = "", seed = "rand", prob = "post", s1 = "script", s2 = "script", prior = "prior") {
    if (!gen) {
        let post = Y.str_to_vec(Y.get_str(prob, "", true));
        Y.set_ans(post.length, name);
        if (post.length != 27) Y.grade_binary(name, 0, -1, Y.incorrect_size_message(post.length, 27));
        else {
            let x1 = Y.str_to_vec(Y.get_str(s1, "", true));
            let x2 = Y.str_to_vec(Y.get_str(s2, "", true));
            let pr = 1 - Y.get_num(prior, 0.5, false, true);
            let p = x1.map((x, i) => (x * pr) / (x * pr + x2[i] * (1 - pr)));
            let close = Y.vec_close(post, p, 3);
            if (close) Y.grade_binary(name, 1);
            else Y.grade_binary(name, 0, -1, "Incorrect probabilities.");
        }
    }
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_nb_act(gen = false, name = "", seed = "rand", act = "act", prob = "post", test = "test") {
    if (!gen) {
        let y = Y.str_to_vec(Y.get_str(act, "", true));
        let script = Y.str_to_str_vec(Y.get_str(test, "", true), "\n");
        Y.set_ans(y.length, name);
        if (y.length != script.length) Y.grade_binary(name, 0, -1, Y.incorrect_size_message(y.length, script.length));
        else {
            let p = Y.str_to_vec(Y.get_str(prob, "", true));
            if (p.length != 27) Y.grade_binary(name, 0, -1, Y.incorrect_size_message(p.length, 27));
            else {
                let c = script.map(s => Y.count_char(s));
                let s1 = c.map(c => c.reduce((s, ci, i) => s + ci * Math.log(p[i]), 0));
                let s2 = c.map(c => c.reduce((s, ci, i) => s + ci * Math.log(1 - p[i]), 0));
                let a = s1.map((s, i) => s > s2[i] ? 1 : 0);
                let close = Y.count_equal(a, y);
                if (close > a.length - 1) Y.grade_binary(name, 1);
                else Y.grade_binary(name, 0, -1, "The labels are inconsistent with the posterior probabilities.");
            }
        }
    }
}
//#endregion

//#region Programming 4
/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_cov_id(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let nc = Y.rand_int(5, 8);
    if (gen) Y.set_blank(name, ["nc"], [nc]);
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_differencing(gen = false, name = "", seed = "rand", diff = "@diff", ori = "@ori") {
    if (!gen) {
        let x = Y.str_to_mat_line(Y.get_str(ori, "", true), false);
        let d = Y.str_to_mat_line(Y.get_str(diff, "", true), false);
        Y.set_ans(x[0] ? x[0].length : 0, name);
        if (x.length < 2 || d.length < 2 || x[0].length < 100 || x[1].length < 100 || d[0].length != x[0].length - 1 || d[1].length != x[1].length - 1) Y.grade_binary(name, 0, -1, Y.incorrect_size_message(x.length, 2, x[0].length, 100, true));
        else {
            let dx0 = Y.ts_diff(x[0]);
            let dx1 = Y.ts_diff(x[1]);
            let c0 = Y.count_equal(d[0], dx0);
            let c1 = Y.count_equal(d[1], dx1);
            Y.set_ans(c0 + c1, name);
            Y.grade_scalar(name, dx0.length + dx1.length);
        }
    }
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_center(gen = false, name = "", seed = "rand", center = "center", cluster = "cluster", data = "data") {
    if (!gen) {
        let x = Y.str_to_mat_line(Y.get_str(data, "", true), false);
        let c = Y.str_to_mat_line(Y.get_str(center, "", true), false);
        let y = Y.str_to_vec(Y.get_str(cluster, "", true), false);
        let k = Y.get_num("@nc_0", 0);
        let m = Y.n_col(c);
        Y.set_ans(0, name);
        if (c.length != k || c[0].length != x[0].length) Y.grade_binary(name, 0, -1, Y.incorrect_size_message(c.length, k, m, x[0].length));
        else {
            let nc = Y.center_k_means(x, y, c);
            let d = nc.reduce((s, ci, i) => s + Y.dist(ci, c[i], 2), 0);
            Y.set_ans(d, name);
            if (d > 1) Y.grade_binary(name, 0, -1, "K-means did not converge.");
            else Y.grade_binary(name, 1);
        }
    }
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_cluster(gen = false, name = "", seed = "rand", hac = "hac", data = "data", method = "single") {
    if (!gen) {
        let x = Y.str_to_mat_line(Y.get_str(data, "", true), false);
        let h = Y.str_to_vec(Y.get_str(hac, "", true), false);
        let k = Y.get_num("@nc_0", 0);
        if (x.length < 50 || x.length != h.length) Y.grade_binary(name, 0, -1, "Incorrect vector length.");
        else if (Math.max(...h) > k - 1 || Math.min(...h) < 0) Y.grade_binary(name, 0, -1, "Incorrect number of clusters.");
        else {
            let cluster = {};
            if (method.startsWith("k")) {
                let initial = Y.center_k_means(x, h, Y.zero_mat(k, x[0].length));
                cluster = Y.train_k_means(x, k, { l: 2, initial: initial });
            }
            else cluster = Y.train_h_cluster(x, k, { l: 2, method: method });
            let y = cluster.cluster;
            let d = Y.rand_index(y, h);
            let acc = Y.acc_to_list(d, [0.5, 0.75, 0.85, 0.9, 0.95]);
            Y.set_ans(acc.join(","), name);
            Y.grade_vector(name, [0.5, 0.75, 0.85, 0.9, 0.95]);
        }
    }
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_distortion(gen = false, name = "", seed = "rand", means = "means", centers = "centers", data = "data") {
    if (!gen) {
        let x = Y.str_to_mat_line(Y.get_str(data, "", true), false);
        let y = Y.str_to_vec(Y.get_str(means, "", true), false);
        let c = Y.str_to_mat_line(Y.get_str(centers, "", true), false);
        let d = Y.distortion(x, y, c, { l: 2 });
        Y.grade_scalar(name, d, -1, "The total distortion based on the answers from your previous questions should be: " + Y.round(d, 4) + ".");
    }
}
//#endregion

//#region Programming 5
/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_maze(gen = false, name = "", seed = "rand") {
    Y.rand_seed(seed);
    let w = Y.rand_int(20, 30) * 2 + 1;
    let h = Y.rand_int(20, 30) * 2 + 1;
    let example = "" +
        "+--+--+--+--+--+--+--+  +--+--+--+--+--+--+--+" + "\n" +
        "|     |           |     |        |     |     |" + "\n" +
        "+  +  +--+--+--+  +  +  +  +--+--+  +  +--+  +" + "\n" +
        "|  |           |  |  |  |        |  |  |     |" + "\n" +
        "+  +--+--+--+  +  +  +  +--+  +  +--+  +  +--+" + "\n" +
        "|  |           |     |        |        |     |" + "\n" +
        "+  +  +--+--+--+--+  +--+--+--+--+--+--+--+  +" + "\n" +
        "|  |     |           |     |     |        |  |" + "\n" +
        "+  +--+  +  +--+--+--+  +  +  +  +  +--+  +  +" + "\n" +
        "|     |  |  |           |     |  |  |        |" + "\n" +
        "+--+  +  +  +  +--+--+--+--+--+  +  +--+--+--+" + "\n" +
        "|     |     |  |  |        |     |           |" + "\n" +
        "+  +--+--+--+  +  +  +  +--+  +--+--+--+--+  +" + "\n" +
        "|     |        |     |  |     |        |  |  |" + "\n" +
        "+--+  +  +  +--+--+  +  +  +--+  +--+  +  +  +" + "\n" +
        "|     |  |  |        |  |     |  |        |  |" + "\n" +
        "+  +--+  +  +--+--+--+  +--+  +  +--+--+  +  +" + "\n" +
        "|  |  |  |  |           |     |  |        |  |" + "\n" +
        "+  +  +  +  +  +--+--+--+  +  +  +  +--+--+  +" + "\n" +
        "|     |  |     |           |     |  |     |  |" + "\n" +
        "+  +--+  +--+  +  +--+--+--+--+--+  +--+  +  +" + "\n" +
        "|     |     |  |     |           |  |     |  |" + "\n" +
        "+--+  +--+  +  +--+  +  +--+--+  +  +  +--+  +" + "\n" +
        "|     |     |  |     |  |     |  |           |" + "\n" +
        "+  +--+  +--+  +  +--+  +  +  +  +--+  +--+--+" + "\n" +
        "|        |     |     |     |  |        |     |" + "\n" +
        "+--+--+--+  +--+--+  +--+--+  +--+--+  +  +  +" + "\n" +
        "|     |     |     |  |     |  |        |  |  |" + "\n" +
        "+  +  +  +--+--+  +  +  +--+  +  +--+--+  +  +" + "\n" +
        "|  |     |           |        |           |  |" + "\n" +
        "+--+--+--+--+--+--+--+  +--+--+--+--+--+--+--+";
    let solution = "" +
        "+--+--+--+--+--+--+--+##+--+--+--+--+--+--+--+" + "\n" +
        "|#####|           |#####|        |     |     |" + "\n" +
        "+##+##+--+--+--+  +##+  +  +--+--+  +  +--+  +" + "\n" +
        "|##|###########|  |##|  |        |  |  |     |" + "\n" +
        "+##+--+--+--+##+  +##+  +--+  +  +--+  +  +--+" + "\n" +
        "|##|###########|   ##|        |        |     |" + "\n" +
        "+##+##+--+--+--+--+##+--+--+--+--+--+--+--+  +" + "\n" +
        "|##|#####|###########|#####|#####|        |  |" + "\n" +
        "+##+--+##+##+--+--+--+##+##+##+##+  +--+  +  +" + "\n" +
        "|#####|##|##|###########|#####|##|  |        |" + "\n" +
        "+--+##+##+##+##+--+--+--+--+--+##+  +--+--+--+" + "\n" +
        "|#####|#####|##|  |        |#####|           |" + "\n" +
        "+##+--+--+--+##+  +  +  +--+##+--+--+--+--+  +" + "\n" +
        "|#####|########|     |  |#####|########|  |  |" + "\n" +
        "+--+##+##+  +--+--+  +  +##+--+##+--+##+  +  +" + "\n" +
        "|#####|##|  |        |  |#####|##|   #####|  |" + "\n" +
        "+##+--+##+  +--+--+--+  +--+##+##+--+--+##+  +" + "\n" +
        "|##|  |##|  |           |   ##|##|########|  |" + "\n" +
        "+##+  +##+  +  +--+--+--+  +##+##+##+--+--+  +" + "\n" +
        "|##   |##|     |           |#####|##|     |  |" + "\n" +
        "+##+--+##+--+  +  +--+--+--+--+--+##+--+  +  +" + "\n" +
        "|#####|#####|  |     |###########|##|     |  |" + "\n" +
        "+--+##+--+##+  +--+  +##+--+--+##+##+  +--+  +" + "\n" +
        "|#####|#####|  |     |##|#####|##|#####      |" + "\n" +
        "+##+--+##+--+  +  +--+##+##+##+##+--+##+--+--+" + "\n" +
        "|########|     |     |#####|##|########|     |" + "\n" +
        "+--+--+--+  +--+--+  +--+--+##+--+--+  +  +  +" + "\n" +
        "|     |     |     |  |     |##|        |  |  |" + "\n" +
        "+  +  +  +--+--+  +  +  +--+##+  +--+--+  +  +" + "\n" +
        "|  |     |           |########|           |  |" + "\n" +
        "+--+--+--+--+--+--+--+##+--+--+--+--+--+--+--+";
    if (gen) Y.set_blank(name, ["h", "w", "example", "solution"], [h, w, example, solution]);
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_check_maze(gen = false, name = "", seed = "rand", plot = "plot", path = "solution", solution = false) {
    if (!gen) {
        let th = Y.get_num(Y.field_name("h_0"), 0);
        let tw = Y.get_num(Y.field_name("w_0"), 0);
        let maze = Y.get_str(Y.field_name(plot)).split("\n");
        let h = (maze.length - 1) / 2;
        let w = (maze[0].trim().length - 1) / 3;
        if (th != h || tw != w) {
            Y.set_ans("Incorrect maze size.", name);
            Y.grade_binary(name);
        }
        else {
            if (!solution) {
                Y.set_ans(th + ", " + tw, name);
                Y.grade_vector(name, [th, tw]);
            }
            else {
                let sol = Y.get_str(Y.field_name(path));
                if (!sol.length || sol.length <= th) {
                    Y.set_ans("Incorrect solution.", name);
                    Y.grade_binary(name);
                }
                else {
                    let off = false;
                    let cur = [0, (tw - 1) / 2];
                    for (let i = 0; i < sol.length; i++) {
                        if (!maze[2 * cur[0] + 1] || maze[2 * cur[0] + 1].charAt(3 * cur[1] + 1) != "#" || maze[2 * cur[0] + 1].charAt(3 * cur[1] + 2) != "#") {
                            off = true;
                            break;
                        }
                        if (sol.charAt(i) == "U" && cur[0] > 0) cur[0]--;
                        else if (sol.charAt(i) == "D" && cur[0] < th - 1) cur[0]++;
                        else if (sol.charAt(i) == "L" && cur[1] > 0) cur[1]--;
                        else if (sol.charAt(i) == "R" && cur[1] < tw - 1) cur[1]++;
                    }
                    if (off) {
                        Y.set_ans("Plot inconsistent with solution.", name);
                        Y.grade_binary(name);
                    }
                    else {
                        Y.set_ans(th + ", " + tw, name);
                        Y.grade_vector(name, [th, tw]);
                    }

                }
            }
        }
    }
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_check_path(gen = false, name = "", seed = "rand", path = "solution", suc = "suc") {
    if (!gen) {
        let th = Y.get_num(Y.field_name("h_0"), 0);
        let tw = Y.get_num(Y.field_name("w_0"), 0);
        let s = Y.str_to_str_mat_line(Y.get_str(Y.field_name(suc)));
        if (s.length != th || s[0].length != tw) {
            Y.set_ans("Incorrect maze size.", name);
            Y.grade_binary(name);
        }
        else {
            let x = 0;
            let y = (tw - 1) / 2;
            let ans = Y.get_str(Y.field_name(path)).trim();
            let match = true;
            for (let i = 0; i < ans.length; i++) {
                let dir = ans.charAt(i);
                if (!s[x][y].includes(dir)) match = false;
                else {
                    if (dir == "U") x = Y.bound(x - 1, 0, th - 1);
                    else if (dir == "D") x = Y.bound(x + 1, 0, th - 1);
                    else if (dir == "L") y = Y.bound(y - 1, 0, th - 1);
                    else if (dir == "R") y = Y.bound(y + 1, 0, th - 1);
                }
            }
            if (!match) {
                Y.set_ans("Path goes through walls.", name);
                Y.grade_binary(name);
            }
            else if (x != th - 1 || y != (tw - 1) / 2) {
                Y.set_ans("Path does not lead to exit.", name);
                Y.grade_binary(name);
            }
            else {
                Y.set_ans(1, name);
                Y.grade_scalar(name, 1);
            }
        }
    }
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_check_suc(gen = false, name = "", seed = "rand", suc = "suc", plot = "plot") {
    if (!gen) {
        let th = Y.get_num(Y.field_name("h_0"), 0);
        let tw = Y.get_num(Y.field_name("w_0"), 0);
        let maze = Y.get_str(Y.field_name(plot)).trim().split("\n");
        let mat = Y.parse_maze(maze);
        let ans = Y.str_to_str_mat_line(Y.get_str(Y.field_name(suc)));
        if (mat == false) {
            Y.set_ans("Incorrect maze formatting.", name);
            Y.grade_binary(name);
        }
        else if (ans.length != th || ans.length != mat.length || ans[0].length != tw || ans[0].length != mat[0].length) {
            Y.set_ans("Incorrect maze size.", name);
            Y.grade_binary(name);
        }
        else {
            let list = Y.get_suc_pos(mat);
            let search = Y.bfs_maze(list, [0, (tw - 1) / 2], [-1, -1]);
            let missing = Y.mat_sum(search.map(si => si.map(sij => sij >= 0 ? 0 : 1)));
            if (missing > 1) {
                Y.set_ans("The maze is not connected to every cell.", name);
                Y.grade_binary();
            }
            else {
                let diff = 0;
                for (let i = 0; i < th; i++) {
                    for (let j = 0; j < tw; j++) {
                        if (String(ans[i][j]).trim() != mat[i][j]) diff++;
                    }
                }
                Y.set_ans(diff + 1, name);
                if (diff <= 2) Y.set_ans(1, name);
                Y.grade_scalar(name, 1);
            }
        }
    }
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_distance(gen = false, name = "", seed = "rand", dist = "distances", l = 1) {
    if (!gen) {
        let th = Y.get_num(Y.field_name("h_0"), 0);
        let tw = Y.get_num(Y.field_name("w_0"), 0);
        let ans = Y.str_to_mat_line(Y.get_str(Y.field_name(dist)), false);
        if (ans.length != th || ans[0].length != tw) {
            Y.set_ans("Incorrect maze size.", name);
            Y.grade_binary(name);
        }
        else {
            let d = Y.maze_heuristic(th, tw, th - 1, (tw - 1) / 2, l);
            let diff = Y.mat_add(d, ans, 1, -1);
            let max = Y.mat_max(diff);
            let min = Y.mat_min(diff);
            Y.set_ans(Math.max(max, -min) + 1, name);
            if (max > 1 || min < -1) Y.grade_binary(name);
            else Y.grade_scalar(name, Math.max(max, -min) + 1);
        }
    }
}

/**
 * New question
 * @param {boolean} gen Whether to generate (true) or grade (false) the question
 * @param {string} name Name of the question
 * @param {string} seed Random seed corresponding to the ID
 */
export function q_search_maze(gen = false, name = "", seed = "rand", searched = "s", suc = "suc", path = "solution", method = "bfs") {
    if (!gen) {
        let th = Y.get_num(Y.field_name("h_0"), 0);
        let tw = Y.get_num(Y.field_name("w_0"), 0);
        let s = Y.str_to_str_mat_line(Y.get_str(Y.field_name(suc)));
        let checked = Y.str_to_mat_line(Y.get_str(Y.field_name(searched)), false);
        if (checked.length != th || checked[0].length != tw) {
            Y.set_ans("Incorrect maze size.", name);
            Y.grade_binary(name);
        }
        else {
            let total = Y.mat_sum(checked);
            let sol = Y.get_str(Y.field_name(path));
            Y.set_ans(total, name);
            if (total < sol.length || total > th * tw) Y.grade_binary(name);
            else {
                let maze = Y.get_suc_pos(s);
                let search = [[0]];
                let initial = [0, (tw - 1) / 2];
                let goal = [th - 1, (tw - 1) / 2];
                if (method == "bfs") search = Y.bfs_maze(maze, initial, goal);
                else if (method == "dfs") search = Y.dfs_maze(maze, initial, goal);
                else if (method == "a*1") search = Y.a_star_maze(maze, initial, goal, 1);
                else if (method == "a*2") search = Y.a_star_maze(maze, initial, goal, 2);
                let ans = search.map(si => si.map(sij => sij >= 0 ? 1 : 0));
                let diff = th * tw - Y.count_same(ans, checked);
                Y.set_ans(diff, name);
                if (method == "bfs" && diff < th + tw) Y.grade_scalar(name, diff);
                else if (method == "dfs" && diff < th * tw) Y.grade_scalar(name, diff);
                else if (method == "a*1" && diff < th + tw) Y.grade_scalar(name, diff);
                else if (method == "a*2" && diff < th + tw) Y.grade_scalar(name, diff);
                else Y.grade_binary(name);
            }
        }
    }
}
//#endregion

//#region Exams
export function m1as20e(shuffle = [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    let q = function (gen = false, id = "rand") {
        let x = shuffle.map(String);
        id += x[0];
        q_hinge_gradient(gen, x[0], id, "hinge");
        q_count_weight_nn(gen, x[1], id, 3, true, true);
        q_svm_margin(gen, x[2], id);
        q_entropy(gen, x[3], id, 2);
        q_knn_training_set(gen, x[4], id);
        q_activate_ltu_nn(gen, x[5], id, [2, 1, 1]);
        q_mask_half(gen, x[6], id);
        q_smoothing(gen, x[7], id, 1);
        q_binary_bayes_net(gen, x[8], id, "A->B->C", "ABC");
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

export function m2as20e(shuffle = [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    let q = function (gen = false, id = "rand") {
        let x = shuffle.map(String);
        id += x[0];
        q_remove_svm(gen, x[0], id, true, true);
        q_knn_decision(gen, x[1], id, 5, 2);
        q_mle_conditional(gen, x[2], id, ["N", "Y"]);
        q_two_cdf(gen, x[3], id, ["I", "am", "G" + "root"]);
        q_convolution(gen, x[4], id, 3, 3);
        q_pooling(gen, x[5], id, "average", 4);
        q_kernel_1d(gen, x[6], id, 3);
        q_d_tree_train_size(gen, x[7], id);
        q_count_weight_cnn(gen, x[8], id, true);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

export function m1bs20e(shuffle = [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    let q = function (gen = false, id = "rand") {
        let x = shuffle.map(String);
        id += x[0];
        q_hinge_gradient(gen, x[0], id, "ce");
        q_count_weight_nn(gen, x[1], id, 3, true, true);
        q_one_vs_one(gen, x[2], id, 5);
        q_entropy_constant(gen, x[3], id);
        q_knn_training_set(gen, x[4], id);
        q_activate_ltu_nn(gen, x[5], id, [2, 1, 1]);
        q_bayes_rule(gen, x[6], id, ["A", "B"], ["H", "T"], 2);
        q_mle_sum(gen, x[7], id);
        q_binary_bayes_net(gen, x[8], id, "A<-B->C", "ABC");
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

export function m2bs20e(shuffle = [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    let q = function (gen = false, id = "rand") {
        let x = shuffle.map(String);
        id += x[0];
        q_remove_svm(gen, x[0], id, true, true);
        q_knn_decision(gen, x[1], id, 5, 2);
        q_word_mle(gen, x[2], id, 5);
        q_skip_markov_chain(gen, x[3], id, ["I", "am", "G" + "root"]);
        q_convolution(gen, x[4], id, 3, 3);
        q_pooling(gen, x[5], id, "average", 4);
        q_feature_to_kernel(gen, x[6], id, 3);
        q_d_tree_train_size(gen, x[7], id);
        q_count_weight_cnn(gen, x[8], id, false);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

export function f1as20e(shuffle = [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    let q = function (gen = false, id = "rand") {
        let x = shuffle.map(String);
        id += x[0];
        q_local_1d_search(gen, x[0], id, false, true);
        q_pd_game(gen, x[1], id);
        q_vaccine(gen, x[2], id);
        q_proj_var(gen, x[3], id, 3);
        q_hac_dist(gen, x[4], id, "complete", 4);
        q_branching(gen, x[5], id, "dfs");
        q_annealing_p(gen, x[6], id, false);
        q_h_admissible_list(gen, x[7], id, 6, false);
        q_cts_mix_game(gen, x[8], id, true);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

export function f2as20e(shuffle = [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    let q = function (gen = false, id = "rand") {
        let x = shuffle.map(String);
        id += x[0];
        q_large_tree_search(gen, x[0], id, "bfs");
        q_integer_search(gen, x[1], id);
        q_zero_sum_value(gen, x[2], id, [4, 4]);
        q_k_cluster_dist(gen, x[3], id, 1, 6, 2, 2);
        q_reorder_prune(gen, x[4], id, [3, 3], true);
        q_chance_game(gen, x[5], id, false);
        q_crime_report(gen, x[6], id);
        q_proj(gen, x[7], id, 3);
        q_donate_game(gen, "9", id);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

export function m1as20c(shuffle = [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    let q = function (gen = false, id = "rand") {
        let x = shuffle.map(String);
        id += x[0];
        q_ltu_update(gen, x[0], id, 2);
        q_count_weight_nn(gen, x[1], id, 3, true, true);
        q_slack_value(gen, x[2], id, 3);
        q_entropy(gen, x[3], id, 2);
        q_loo_knn(gen, x[4], id);
        q_activate_ltu_nn(gen, x[5], id, [2, 1, 1]);
        q_bayes_rule(gen, x[6], id, ["A", "B"], ["H", "T"], 2);
        q_smoothing(gen, x[7], id, 1);
        q_binary_bayes_net(gen, x[8], id, "A->B<-C", "ABC");
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

export function m1bs20c(shuffle = [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    let q = function (gen = false, id = "rand") {
        let x = shuffle.map(String);
        id += x[0];
        q_ltu_update_const(gen, x[0], id);
        q_count_weight_nn(gen, x[1], id, 3, true, true);
        q_svm_kernel_sum(gen, x[2], id, 2, 2);
        q_mutual_info_constant(gen, x[3], id);
        q_loo_knn(gen, x[4], id);
        q_activate_ltu_nn(gen, x[5], id, [2, 1, 1]);
        q_forget_homework(gen, x[6], id);
        q_cond_entropy_table(gen, x[7], id, 8);
        q_multi_naive_bayes(gen, x[8], id, 3);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

export function m2as20c(shuffle = [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    let q = function (gen = false, id = "rand") {
        let x = shuffle.map(String);
        id += x[0];
        q_remove_svm(gen, x[0], id, true, false);
        q_knn_decision(gen, x[1], id, 5, 2);
        q_word_mle(gen, x[2], id, 1);
        q_binary_naive_bayes(gen, x[3], id);
        q_gradient_magnitude(gen, x[4], id, 1, 3);
        q_switch_cond(gen, x[5], id);
        q_feature_to_kernel(gen, x[6], id, 3);
        q_cpt_count_naive(gen, x[7], id);
        q_count_weight_cnn(gen, x[8], id, true);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

export function m2bs20c(shuffle = [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    let q = function (gen = false, id = "rand") {
        let x = shuffle.map(String);
        id += x[0];
        q_remove_svm(gen, x[0], id, true, false);
        q_zero_one_cost(gen, x[1], id, 6);
        q_knn_decision(gen, x[2], id, 5, 2);
        q_skip_markov_chain(gen, x[3], id, ["I", "am", "G" + "root"]);
        q_convolution(gen, x[4], id, 3, 3);
        q_switch_cond(gen, x[5], id);
        q_feature_to_kernel(gen, x[6], id, 3);
        q_cpt_count_naive(gen, x[7], id);
        q_count_weight_cnn(gen, x[8], id, false);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

export function f1bs20e(shuffle = [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    let q = function (gen = false, id = "rand") {
        let x = shuffle.map(String);
        id += x[0];
        q_local_1d_search(gen, x[0], id, false);
        q_pd_game(gen, x[1], id);
        q_vaccine(gen, x[2], id);
        q_proj_var(gen, x[3], id, 3);
        q_hac_dist(gen, x[4], id, "single", 4);
        q_search_lucky(gen, x[5], id, "dfs");
        q_cluster_given(gen, x[6], id, 5, false);
        q_h_admissible_list(gen, x[7], id, 6, true);
        q_cts_mix_game(gen, x[8], id, false);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

export function f2bs20e(shuffle = [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    let q = function (gen = false, id = "rand") {
        let x = shuffle.map(String);
        id += x[0];
        q_large_tree_search(gen, x[0], id, "dfs");
        q_hill_linear(gen, x[1], id, 3);
        q_zero_sum_value(gen, x[2], id, [4, 4]);
        q_k_cluster_center(gen, x[3], id, 2, 4, 2);
        q_reorder_prune(gen, x[4], id, [3, 3], true);
        q_chance_game(gen, x[5], id, false);
        q_crime_report(gen, x[6], id);
        q_pca_new_x(gen, x[7], id, 2, 3);
        q_donate_game(gen, "9", id);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

export function f1as20c(shuffle = [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    let q = function (gen = false, id = "rand") {
        let x = shuffle.map(String);
        id += x[0];
        q_cluster_given(gen, x[0], id, 5, false);
        q_switch_on_off(gen, x[1], id, true);
        q_vaccine(gen, x[2], id);
        q_proj_var(gen, x[3], id, 3);
        q_hac_dist(gen, x[4], id, "single", 4);
        q_search_lucky(gen, x[5], id, "ids");
        q_hill_linear(gen, x[6], id, 3);
        q_max_mix(gen, x[7], id, false);
        q_ie_sds(gen, x[8], id, [4, 4]);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

export function f1bs20c(shuffle = [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    let q = function (gen = false, id = "rand") {
        let x = shuffle.map(String);
        id += x[0];
        q_cluster_given(gen, x[0], id, 5, true);
        q_switch_on_off(gen, x[1], id, false);
        q_vaccine(gen, x[2], id);
        q_pca_new_x(gen, x[3], id, 2, 3);
        q_hac_dist(gen, x[4], id, "single", 4);
        q_branching(gen, x[5], id, "dfs");
        q_annealing_p(gen, x[6], id, false);
        q_max_mix(gen, x[7], id, true);
        q_zero_sum_value(gen, x[8], id, [4, 4]);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

export function f2as20c(shuffle = [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    let q = function (gen = false, id = "rand") {
        let x = shuffle.map(String);
        id += x[0];
        q_quick_tree(gen, x[0], id);
        q_h_admissible_list(gen, x[1], id, 6, true);
        q_h_admissible_list(gen, x[2], id + "0", 6, false);
        q_hill_random(gen, x[3], id);
        q_alpha_beta_range(gen, x[4], id, -1, [3, 5], true, false);
        q_chance_game(gen, x[5], id, true);
        q_cts_mix_game(gen, x[6], id, true);
        q_highway(gen, x[7], id);
        q_donate_game(gen, "9", id);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

export function f2bs20c(shuffle = [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    let q = function (gen = false, id = "rand") {
        let x = shuffle.map(String);
        id += x[0];
        q_integer_search(gen, x[0], id);
        q_large_tree_search(gen, x[1], id, "dfs");
        q_graph_to_search(gen, x[2], id, "ids", 8);
        q_genetic_cross(gen, x[3], id, 4, 4);
        q_alpha_beta_range(gen, x[4], id, -1, [3, 5], false, false);
        q_chance_game(gen, x[5], id, false);
        q_cts_mix_game(gen, x[6], id, false);
        q_highway(gen, x[7], id);
        q_donate_game(gen, "9", id);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

//#endregion

//#region Programming Homework
/**
 * Programming Homework 1 Summer 2020
 */
export function p1s20e() {
    let q = function (gen = false, id = "rand") {
        q_mn_ist(gen, "0", id);
        q_check_vec_dim(gen, "1", id, "training", 28 * 28);
        q_check_vec_dim(gen, "2", id, "log_weights", 28 * 28 + 1);
        q_log_act(gen, "3", id, "log_act", "test_0", "log_weights");
        q_class_from_act(gen, "4", id, "log_pred", "log_act", "test_0");
        q_check_mat_dim(gen, "5", id, "in_weights", 28 * 28 + 1, 28 * 28 / 2);
        q_check_vec_dim(gen, "6", id, "out_weights", 28 * 28 / 2 + 1);
        q_nn_act(gen, "7", id, "nn_act", "test_0", "in_weights", "out_weights");
        q_class_from_act(gen, "8", id, "nn_pred", "nn_act", "test_0");
        q_check_vec_dim(gen, "9", id, "incorrect", 28 * 28);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

/**
 * Programming Homework 2 Summer 2020
 */
export function p2s20e() {
    let q = function (gen = false, id = "rand") {
        q_wisconsin(gen, "0", id);
        q_empty_vec(gen, "1", id, 2);
        q_tree_entropy(gen, "2", id, "answer_1");
        q_empty_vec(gen, "3", id, 4);
        q_tree_entropy(gen, "4", id, "answer_1", "answer_3");
        q_check_tree(gen, "5", id, "tree_full", false, "", "vars_0");
        q_check_tree(gen, "6", id, "tree_full", true, "", "vars_0");
        q_tree_act(gen, "7", id, "label_full", "tree_full", "test_0");
        q_check_tree(gen, "8", id, "tree_pruned", false, "depth_0", "vars_0");
        q_tree_act(gen, "9", id, "label_pruned", "tree_pruned", "test_0");
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

/**
 * Programming Homework 3 Summer 2020
 */
export function p3s20e() {
    let q = function (gen = false, id = "rand") {
        q_script(gen, "0", id);
        q_empty(gen, "1", id);
        q_check_prob(gen, "2", id, "uni" + "gram", 1, 27, false);
        q_check_prob(gen, "3", id, "bi" + "gram", 27, 27, false);
        q_check_prob(gen, "4", id, "bi" + "gram_smooth", 27, 27, true);
        q_check_mc(gen, "5", id, "sentences", "uni" + "gram", 26 * 1000);
        q_empty(gen, "6", id);
        q_check_uni(gen, "7", id, "likelihood", "script_0");
        q_check_post(gen, "8", id, "posterior", "likelihood", "uni" + "gram");
        q_nb_act(gen, "9", id, "predictions", "posterior", "sentences");
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

/**
 * Programming Homework 4 Summer 2020
 */
export function p4s20e() {
    let q = function (gen = false, id = "rand") {
        q_cov_id(gen, "0", id);
        q_check_mat_dim_larger(gen, "1", id, "original", 2, 100);
        q_differencing(gen, "2", id, "difference", "original");
        q_empty(gen, "3", id);
        q_check_mat_dim_larger(gen, "4", id, "parameters", 100, 3);
        q_cluster(gen, "5", id, "hac" + "s", "parameters", "single");
        q_cluster(gen, "6", id, "hac" + "c", "parameters", "complete");
        q_cluster(gen, "7", id, "k" + "means", "parameters", "k" + "means");
        q_center(gen, "8", id, "centers", "k" + "means", "parameters");
        q_distortion(gen, "9", id, "k" + "means", "centers", "parameters");
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

/**
 * Programming Homework 5 Summer 2020
 */
export function p5s20e() {
    let q = function (gen = false, id = "rand") {
        q_maze(gen, "0", id);
        q_check_maze(gen, "1", id, "plot", "solution", false);
        q_check_suc(gen, "2", id, "suc" + "c", "plot");
        q_check_path(gen, "3", id, "solution", "suc" + "c");
        q_check_maze(gen, "4", id, "plot_solution", "solution", true);
        q_search_maze(gen, "5", id, "bfs", "suc" + "c", "solution", "bfs");
        q_search_maze(gen, "6", id, "dfs", "suc" + "c", "solution", "dfs");
        q_distance(gen, "7", id, "distances", 1);
        q_search_maze(gen, "8", id, "a_manhattan", "suc" + "c", "solution", "a*1");
        q_search_maze(gen, "9", id, "a_euclidean", "suc" + "c", "solution", "a*2");
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

/**
 * Programming Homework 6 Summer 2020
 */
export function p6s20e() {
    let q = function (gen = false, id = "rand") {
        q_empty(gen, "1", id);
        q_empty(gen, "2", id);
        q_check(gen, "3", id);
        q_check(gen, "4", id);
        q_empty(gen, "5", id);
    };
    Y.set_questions(q);
}
//#endregion

//#region Math Homework 2020
/**
 * Math Homework 1 Summer 2020
 */
export function m1s20e() {
    let q = function (gen = false, id = "rand") {
        q_sum_geometric(gen, "1", id);
        q_plane_normal(gen, "2", id);
        q_hessian(gen, "3", id);
        q_derivative(gen, "4", id);
        q_circle_inside(gen, "5", id);
        q_spanning_tree(gen, "6", id);
        q_margin_sum(gen, "7", id);
        q_separator(gen, "8", id);
        q_mat_to_digraph(gen, "9", id);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

/**
 * Math Homework 2 Summer 2020
 */
export function m2s20e() {
    let q = function (gen = false, id = "rand") {
        q_step_size(gen, "1", id);
        q_grad_descent(gen, "2", id);
        q_rlu_inverse(gen, "3", id);
        q_ltu_update(gen, "4", id, 3);
        q_ltu_update_const(gen, "5", id);
        q_convex(gen, "6", id);
        q_sigmoid_inverse(gen, "7", id);
        q_percept_and(gen, "8", id);
        q_empty(gen, "9", id);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

/**
 * Math Homework 3 Summer 2020
 */
export function m3s20e() {
    let q = function (gen = false, id = "rand") {
        q_linear_nn(gen, "1", id);
        q_flip_accuracy(gen, "2", id);
        q_test_accuracy(gen, "3", id);
        q_sigmoid_tanh(gen, "4", id);
        q_count_weight_nn(gen, "5", id, 3, true, true);
        q_fun_to_weights(gen, "6", id, [2, 2, 1], [1, 0, 0]);
        q_fun_to_weights(gen, "7", id + "*", [2, 2, 1], [0, 0, 0]);
        q_one_hot(gen, "8", id, 3);
        q_empty(gen, "9", id);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

/**
 * Math Homework 4 Summer 2020
 */
export function m4s20e() {
    let q = function (gen = false, id = "rand") {
        q_svm_pred(gen, "1", id, 5, 4);
        q_svm_margin(gen, "2", id, 3);
        q_svm_kernel_sum(gen, "3", id, 2, 2);
        q_svm_slack_zero(gen, "4", id, 3);
        q_vc_dim(gen, "5", id, 5);
        q_dist_line_origin(gen, "6", id, 3);
        q_slack_value(gen, "7", id, 3);
        q_svm_weights(gen, "8", id);
        q_empty(gen, "9", id);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

/**
 * Math Homework 5 Summer 2020
 */
export function m5s20e() {
    let q = function (gen = false, id = "rand") {
        q_manhattan_dist(gen, "1", id, 4);
        q_knn_grid(gen, "2", id, 5);
        q_knn_class(gen, "3", id);
        q_d_tree_cts_threshold(gen, "4", id);
        q_d_tree_train_size(gen, "5", id);
        q_entropy_constant(gen, "6", id);
        q_entropy(gen, "7", id, 2);
        q_mutual_info_constant(gen, "8", id);
        q_empty(gen, "9", id);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

/**
 * Math Homework 6 Summer 2020
 */
export function m6s20e() {
    let q = function (gen = false, id = "rand") {
        q_bayes_rule(gen, "1", id, ["A", "B"], ["H", "T"], 2);
        q_smoothing(gen, "2", id);
        q_cycle_change(gen, "3", id, ["green", "yellow", "red"]);
        q_specify_joint(gen, "4", id);
        q_word_mle(gen, "5", id);
        q_zip_f_ratio(gen, "6", id);
        q_mle_conditional(gen, "7", id, ["N", "Y"]);
        q_bird_flu(gen, "8", id);
        q_empty(gen, "9", id);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

/**
 * Math Homework 7 Summer 2020
 */
export function m7s20e() {
    let q = function (gen = false, id = "rand") {
        q_binary_naive_bayes(gen, "1", id);
        q_binary_bayes_net(gen, "2", id, "A->B<-C", "ABC");
        q_binary_bayes_net(gen, "3", id, "A->B->C", "A|C");
        q_binary_bayes_net(gen, "4", id, "A<-B->C", "A|C");
        q_cpt_count(gen, "5", id);
        q_cpt_smooth(gen, "6", id);
        q_n_gram_count(gen, "7", id);
        q_rand_coin(gen, "8", id);
        q_empty(gen, "9", id);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

/**
 * Math Homework 8 Summer 2020
 */
export function m8s20e() {
    let q = function (gen = false, id = "rand") {
        q_pca_new_x(gen, "1", id);
        q_proj(gen, "2", id);
        q_k_cluster_dist(gen, "3", id, 1, 6, 2);
        q_k_cluster_center(gen, "4", id, 2, 4, 2);
        q_cluster_tree(gen, "5", id, 6, 1, "single");
        q_cluster_tree(gen, "6", id, 6, 1, "complete");
        q_initial_center(gen, "7", id);
        q_hac_dist(gen, "8", id, "complete", 5);
        q_empty(gen, "9", id);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

/**
 * Math Homework 9 Summer 2020
 */
export function m9s20e() {
    let q = function (gen = false, id = "rand") {
        q_branching(gen, "1", id, "dfs");
        q_integer_search(gen, "2", id);
        q_three_puzzle(gen, "3", id, 5);
        q_graph_to_search(gen, "4", id, "dfs", 10);
        q_search_to_graph(gen, "5", id, "ids", 6);
        q_dead_end_search(gen, "6", id, "bfs");
        q_search_lucky(gen, "7", id, "ids");
        q_seq_complete_search(gen, "8", id);
        q_empty(gen, "9", id);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

/**
 * Math Homework 10 Summer 2020
 */
export function m10s20e() {
    let q = function (gen = false, id = "rand") {
        q_hh_admissible(gen, "1", id, 5);
        q_h_admissible(gen, "2", id, 5, true);
        q_h_admissible(gen, "3", id, 5, false);
        q_hill_global(gen, "4", id);
        q_annealing_t(gen, "5", id);
        q_annealing_p(gen, "6", id, true);
        q_hill_random(gen, "7", id);
        q_genetic_cross(gen, "8", id, 6, 4);
        q_empty(gen, "9", id);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

/**
 * Math Homework 11 Summer 2020
 */
export function m11s20e() {
    let q = function (gen = false, id = "rand") {
        q_check(gen, "1", id);
    };
    Y.set_questions(q);
}

/**
 * Math Homework 12 Summer 2020
 */
export function m12s20e() {
    let q = function (gen = false, id = "rand") {
        q_alpha_beta_range(gen, "1", id, 5, [0, 2]);
        q_alpha_beta(gen, "2", id, [2, 4], true);
        q_alpha_beta(gen, "3", id, [1, 5], false);
        q_flip_game(gen, "4", id);
        q_mixed_br(gen, "5", id, [3, 3], 0);
        q_zero_sum_nash(gen, "6", id, [3, 3]);
        q_zero_sum_value(gen, "7", id + "7", [3, 3]);
        q_ie_sds(gen, "8", id);
        q_empty(gen, "9", id);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

/**
 * Math Homework 13 Campus Summer 2020
 */
export function m13s20c() {
    let q = function (gen = false, id = "rand") {
        q_cluster_given(gen, "1", id, 5, true);
        q_switch_on_off(gen, "2", id, true);
        q_vaccine(gen, "3", id);
        q_empty(gen, "4", id);
        q_empty(gen, "5", id);
    };
    Y.set_questions(q);
}

/**
 * Math Homework 13 Epic Summer 2020
 */
export function m13s20e() {
    let q = function (gen = false, id = "rand") {
        q_local_1d_search(gen, "1", id, false);
        q_pd_game(gen, "2", id);
        q_empty(gen, "3", id);
        q_empty(gen, "4", id);
    };
    Y.set_questions(q);
}
//#endregion

//#region Programming Homework 2021
/**
 * Programming Homework 1 Summer 2021
 */
export function p1s21() {
    let q = function (gen = false, id = "rand") {
        q_mn_ist(gen, "0", id);
        q_check_vec_dim(gen, "1", id, "training", 28 * 28);
        q_check_vec_dim(gen, "2", id, "log_weights", 28 * 28 + 1);
        q_log_act(gen, "3", id, "log_act", "test_0", "log_weights");
        q_class_from_act(gen, "4", id, "log_pred", "log_act", "test_0");
        q_check_mat_dim(gen, "5", id, "in_weights", 28 * 28 + 1, 28);
        q_check_vec_dim(gen, "6", id, "out_weights", 28 + 1);
        q_nn_act(gen, "7", id, "nn_act", "test_0", "in_weights", "out_weights");
        q_class_from_act(gen, "8", id, "nn_pred", "nn_act", "test_0");
        q_check_vec_dim(gen, "9", id, "incorrect", 28 * 28);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

/**
 * Programming Homework 2 Summer 2021
 */
export function p2s21() {
    let q = function (gen = false, id = "rand") {
        q_wisconsin(gen, "0", id);
        q_empty_vec(gen, "1", id, 2);
        q_tree_entropy(gen, "2", id, "answer_1");
        q_empty_vec(gen, "3", id, 4);
        q_tree_entropy(gen, "4", id, "answer_1", "answer_3");
        q_check_tree(gen, "5", id, "tree_full", false, "", "vars_0");
        q_check_tree(gen, "6", id, "tree_full", true, "", "vars_0");
        q_tree_act(gen, "7", id, "label_full", "tree_full", "test_0");
        q_check_tree(gen, "8", id, "tree_pruned", false, "depth_0", "vars_0");
        q_tree_act(gen, "9", id, "label_pruned", "tree_pruned", "test_0");
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

/**
 * Programming Homework 3 Summer 2021
 */
export function p3s21() {
    let q = function (gen = false, id = "rand") {
        q_script(gen, "0", id);
        q_empty(gen, "1", id);
        q_check_prob(gen, "2", id, "uni" + "gram", 1, 27, false);
        q_check_prob(gen, "3", id, "bi" + "gram", 27, 27, false);
        q_check_prob(gen, "4", id, "bi" + "gram_smooth", 27, 27, true);
        q_check_mc(gen, "5", id, "sentences", "uni" + "gram", 26 * 1000);
        q_empty(gen, "6", id);
        q_check_uni(gen, "7", id, "likelihood", "script_0");
        q_check_post(gen, "8", id, "posterior", "likelihood", "uni" + "gram", "prior_0");
        q_nb_act(gen, "9", id, "predictions", "posterior", "sentences");
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

/**
 * Programming Homework 4 Summer 2021
 */
export function p4s21() {
    let q = function (gen = false, id = "rand") {
        q_cov_id(gen, "0", id);
        q_check_mat_dim_larger(gen, "1", id, "original", 2, 50);
        q_differencing(gen, "2", id, "difference", "original");
        q_empty(gen, "3", id);
        q_check_mat_dim_larger(gen, "4", id, "parameters", 50, 3);
        q_cluster(gen, "5", id, "hac" + "s", "parameters", "single");
        q_cluster(gen, "6", id, "hac" + "c", "parameters", "complete");
        q_cluster(gen, "7", id, "k" + "means", "parameters", "k" + "means");
        q_center(gen, "8", id, "centers", "k" + "means", "parameters");
        q_distortion(gen, "9", id, "k" + "means", "centers", "parameters");
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

/**
 * Programming Homework 5 Summer 2021
 */
export function p5s21() {
    let q = function (gen = false, id = "rand") {
        q_maze(gen, "0", id);
        q_check_maze(gen, "1", id, "plot", "solution", false);
        q_check_suc(gen, "2", id, "suc" + "c", "plot");
        q_check_path(gen, "3", id, "solution", "suc" + "c");
        q_check_maze(gen, "4", id, "plot_solution", "solution", true);
        q_search_maze(gen, "5", id, "bfs", "suc" + "c", "solution", "bfs");
        q_search_maze(gen, "6", id, "dfs", "suc" + "c", "solution", "dfs");
        q_distance(gen, "7", id, "distances", 1);
        q_search_maze(gen, "8", id, "a_manhattan", "suc" + "c", "solution", "a*1");
        q_search_maze(gen, "9", id, "a_euclidean", "suc" + "c", "solution", "a*2");
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

/**
 * Programming Homework 6 Summer 2021
 */
export function p6s21() {
    let q = function (gen = false, id = "rand") {
        q_empty(gen, "1", id);
        q_empty(gen, "2", id);
        q_check(gen, "3", id);
        q_check(gen, "4", id);
        q_check(gen, "5", id);
        q_empty(gen, "6", id, "This question will be graded manually.");
        q_empty(gen, "7", id, "This question will be graded manually.");
        q_empty(gen, "8", id, "This question will be graded manually.");
        q_empty(gen, "9", id);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}
//#endregion

//#region Math Homework 2021
/**
 * Math Homework 1 Summer 2021
 */
export function m1s21() {
    let q = function (gen = false, id = "rand") {
        q_sum_geometric(gen, "1", id);
        q_plane_normal(gen, "2", id);
        q_hessian(gen, "3", id);
        q_derivative(gen, "4", id);
        q_circle_inside(gen, "5", id);
        q_spanning_tree(gen, "6", id);
        q_margin_sum(gen, "7", id);
        q_separator(gen, "8", id);
        q_mat_to_digraph(gen, "9", id);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

/**
 * Math Homework 2 Summer 2021
 */
export function m2s21() {
    let q = function (gen = false, id = "rand") {
        q_step_size(gen, "1", id);
        q_grad_descent(gen, "2", id);
        q_rlu_inverse(gen, "3", id);
        q_ltu_update(gen, "4", id, 3);
        q_ltu_update_const(gen, "5", id);
        q_convex(gen, "6", id);
        q_sigmoid_inverse(gen, "7", id);
        q_percept_and(gen, "8", id);
        q_zero_one_cost(gen, "9", id);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

/**
 * Math Homework 3 Summer 2021
 */
export function m3s21() {
    let q = function (gen = false, id = "rand") {
        q_linear_nn(gen, "1", id);
        q_flip_accuracy(gen, "2", id);
        q_test_accuracy(gen, "3", id);
        q_sigmoid_tanh(gen, "4", id);
        q_count_weight_nn(gen, "5", id, 3, true, true);
        q_fun_to_weights(gen, "6", id, [2, 2, 1], [1, 0, 0]);
        q_fun_to_weights(gen, "7", id, [2, 2, 1], [0, 0, 0]);
        q_one_hot(gen, "8", id, 3);
        q_activate_ltu_nn(gen, "9", id);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

/**
 * Math Homework 4 Summer 2021
 */
export function m4s21() {
    let q = function (gen = false, id = "rand") {
        q_svm_pred(gen, "1", id, 5, 4);
        q_svm_margin(gen, "2", id, 3);
        q_svm_kernel_sum(gen, "3", id, 2, 2);
        q_svm_slack_zero(gen, "4", id, 3);
        q_vc_dim(gen, "5", id, 5);
        q_dist_line_origin(gen, "6", id, 3);
        q_slack_value(gen, "7", id, 3);
        q_svm_weights(gen, "8", id);
        q_remove_svm(gen, "9", id);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

/**
 * Math Homework 5 Summer 2021
 */
export function m5s21() {
    let q = function (gen = false, id = "rand") {
        q_manhattan_dist(gen, "1", id, 4);
        q_knn_grid(gen, "2", id, 5);
        q_knn_class(gen, "3", id);
        q_d_tree_cts_threshold(gen, "4", id);
        q_d_tree_train_size(gen, "5", id);
        q_entropy_constant(gen, "6", id);
        q_entropy(gen, "7", id, 2);
        q_mutual_info_constant(gen, "8", id);
        q_knn_decision(gen, "9", id);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

/**
 * Math Homework 6 Summer 2021
 */
export function m6s21() {
    let q = function (gen = false, id = "rand") {
        q_bayes_rule(gen, "1", id, ["A", "B"], ["H", "T"], 2);
        q_smoothing(gen, "2", id);
        q_cycle_change(gen, "3", id, ["green", "yellow", "red"]);
        q_specify_joint(gen, "4", id);
        q_word_mle(gen, "5", id);
        q_zip_f_ratio(gen, "6", id);
        q_mle_conditional(gen, "7", id, ["N", "Y"]);
        q_bird_flu(gen, "8", id);
        q_not_given(gen, "9", id);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

/**
 * Math Homework 7 Summer 2021
 */
export function m7s21() {
    let q = function (gen = false, id = "rand") {
        q_binary_naive_bayes(gen, "1", id);
        q_binary_bayes_net(gen, "2", id, "A->B<-C", "ABC");
        q_binary_bayes_net(gen, "3", id, "A->B->C", "A|C");
        q_binary_bayes_net(gen, "4", id, "A<-B->C", "A|C");
        q_count_bayes_net(gen, "5", id);
        q_cpt_smooth(gen, "6", id);
        q_n_gram_count(gen, "7", id);
        q_rand_coin(gen, "8", id);
        q_multi_naive_bayes(gen, "9", id);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

/**
 * Math Homework 8 Summer 2021
 */
export function m8s21() {
    let q = function (gen = false, id = "rand") {
        q_pca_new_x(gen, "1", id);
        q_proj(gen, "2", id);
        q_k_cluster_dist(gen, "3", id, 1, 6, 2);
        q_k_cluster_center(gen, "4", id, 2, 4, 2);
        q_cluster_tree(gen, "5", id, 6, 1, "single");
        q_cluster_tree(gen, "6", id + "c", 6, 1, "complete");
        q_initial_center(gen, "7", id);
        q_hac_dist(gen, "8", id, "complete", 5);
        q_cluster_given(gen, "9", id);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

/**
 * Math Homework 9 Summer 2021
 */
export function m9s21() {
    let q = function (gen = false, id = "rand") {
        q_branching(gen, "1", id, "dfs");
        q_integer_search(gen, "2", id);
        q_three_puzzle(gen, "3", id, 5);
        q_graph_to_search(gen, "4", id, "dfs", 10);
        q_search_to_graph(gen, "5", id, "ids", 6);
        q_dead_end_search(gen, "6", id, "bfs");
        q_search_lucky(gen, "7", id, "ids");
        q_seq_complete_search(gen, "8", id);
        q_stack_space(gen, "9", id);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

/**
 * Math Homework 10 Summer 2021
 */
export function m10s21() {
    let q = function (gen = false, id = "rand") {
        q_hh_admissible(gen, "1", id, 5);
        q_h_admissible(gen, "2", id, 5, true);
        q_h_admissible(gen, "3", id, 5, false);
        q_hill_global(gen, "4", id);
        q_annealing_t(gen, "5", id);
        q_annealing_p(gen, "6", id, true);
        q_hill_random(gen, "7", id);
        q_genetic_cross(gen, "8", id, 6, 4);
        q_local_1d_search(gen, "9", id);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

/**
 * Math Homework 11 Summer 2021
 */
export function m11s21() {
    let q = function (gen = false, id = "rand") {
        q_alpha_beta_range(gen, "1", id, 5, [0, 2]);
        q_alpha_beta(gen, "2", id, [2, 4], true);
        q_alpha_beta(gen, "3", id, [1, 5], false);
        q_flip_game(gen, "4", id);
        q_mixed_br(gen, "5", id, [3, 3], 0);
        q_zero_sum_nash(gen, "6", id, [3, 3]);
        q_zero_sum_value(gen, "7", id + "7", [3, 3]);
        q_ie_sds(gen, "8", id);
        q_cts_mix_game(gen, "9", id);
        q_empty(gen, "10", id);
    };
    Y.set_questions(q);
}

/**
 * Math Homework 12 Summer 2021
 */
export function m12s21() {
    let q = function (gen = false, id = "rand") {
        q_check(gen, "1", id);
        for (let i = 2; i < 11; i++) q_empty(gen, String(i), id);
    };
    Y.set_questions(q);
}

/**
 * Math Homework 13 Summer 2021
 */
export function m13s21() {
    let q = function (gen = false, id = "rand") {
        q_complete_info_gain(gen, "1", id);
        q_loo_knn(gen, "2", id);
        q_mask_half(gen, "3", id);
        q_hinge_gradient(gen, "4", id, "hinge");
        q_kernel_1d(gen, "5", id);
        q_missing_ind(gen, "6", id);
        q_pooling(gen, "7", id, "max");
        q_forget_homework(gen, "8", id);
        q_cpt_count_naive(gen, "9", id);
        q_knn_training_set(gen, "10", id);
        q_cond_entropy_table(gen, "11", id);
        q_one_vs_one(gen, "12", id);
        q_two_cdf(gen, "13", id);
        q_gradient_magnitude(gen, "14", id, 2);
        q_empty(gen, "15", id);
    };
    Y.set_questions(q);
}

/**
 * Math Homework 14 Summer 2021
 */
export function m14s21() {
    let q = function (gen = false, id = "rand") {
        q_feature_to_kernel(gen, "1", id);
        q_mle_sum(gen, "2", id);
        q_cross_validation(gen, "3", id);
        q_switch_cond(gen, "4", id);
        q_hinge_gradient(gen, "5", id, "ce");
        q_convolution(gen, "6", id);
        q_count_weight_cnn(gen, "7", id, true);
        q_pooling(gen, "8", id, "average");
        q_skip_markov_chain(gen, "9", id);
        q_gradient_magnitude(gen, "10", id, 1);
        q_count_candidate(gen, "11", id);
        q_knn_last(gen, "12", id);
        q_children_boy(gen, "13", id);
        q_hmm(gen, "14", id);
        q_empty(gen, "15", id);
    };
    Y.set_questions(q);
}

/**
 * Math Homework 15 Summer 2021
 */
export function m15s21() {
    let q = function (gen = false, id = "rand") {
        for (let i = 0; i < 16; i++) q_empty(gen, String(i), id);
    };
    Y.set_questions(q);
}

/**
 * Math Homework 16 Summer 2021
 */
export function m16s21() {
    let q = function (gen = false, id = "rand") {
        for (let i = 0; i < 16; i++) q_empty(gen, String(i), id);
    };
    Y.set_questions(q);
}

/**
 * Math Homework 17 Summer 2021
 */
export function m17s21() {
    let q = function (gen = false, id = "rand") {
        q_hmm(gen, "1", id);
        for (let i = 2; i < 16; i++) q_empty(gen, String(i), id);
    };
    Y.set_questions(q);
}
//#endregion

//#region Exams 2021
export function x1s21(shuffle = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]) {
    let q = function (gen = false, id = "rand") {
        let x = shuffle.map(String);
        id += x[0];
        q_ltu_update(gen, x[0], id, 1);
        q_sigmoid_inverse(gen, x[1], id);
        q_entropy_constant(gen, x[2], id);
        q_knn_decision(gen, x[3], id, 6, 3);
        q_root_gram(gen, x[4], id);
        q_bayes_rule(gen, x[5], id, ["A", "B"], ["H", "T"], 3);
        q_smoothing(gen, x[6], id);
        q_svm_full_support(gen, x[7], id, 3, true);
        q_pooling(gen, x[8], id);
        q_two_cdf(gen, x[9], id);
        q_knn_vowel(gen, x[10], id);
        q_var_reduce(gen, x[11], id);
        q_knn_last(gen, x[12], id);
        q_children_boy(gen, x[13], id);
        q_empty(gen, x[14], id);
    };
    Y.set_questions(q);
}

export function x2s21(shuffle = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]) {
    let q = function (gen = false, id = "rand") {
        let x = shuffle.map(String);
        id += x[0] + "M";
        q_ltu_update(gen, x[0], id, 1);
        q_rlu_inverse(gen, x[1], id);
        q_entropy(gen, x[2], id);
        q_knn_vowel(gen, x[3], id);
        q_root_gram(gen, x[4], id);
        q_bayes_rule(gen, x[5], id, ["A", "B"], ["H", "T"], 3);
        q_word_mle(gen, x[6], id);
        q_svm_full_support(gen, x[7], id, 3, false);
        q_gradient_direction(gen, x[8], id);
        q_two_cdf(gen, x[9], id);
        q_max_entropy(gen, x[10], id);
        q_var_reduce(gen, x[11], id);
        q_knn_last(gen, x[12], id);
        q_children_boy(gen, x[13], id);
        q_empty(gen, x[14], id);
    };
    Y.set_questions(q);
}

export function x3s21(shuffle = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]) {
    let q = function (gen = false, id = "rand") {
        let x = shuffle.map(String);
        id += x[0];
        q_activate_ltu_nn(gen, x[0], id);
        q_flip_accuracy(gen, x[1], id);
        q_svm_kernel_sum(gen, x[2], id);
        q_slack_value(gen, x[3], id, 2);
        q_binary_bayes_net(gen, x[4], id, "A->B->C");
        q_bayes_net_train(gen, x[5], id);
        q_sub_grad(gen, x[6], id);
        q_skip_markov_chain(gen, x[7], id);
        q_count_weight_cnn(gen, x[8], id, false, true);
        q_svm_transform(gen, x[9], id);
        q_min_knn(gen, x[10], id);
        q_feature_range(gen, x[11], id);
        q_hmm(gen, x[12], id);
        q_reinforce(gen, x[13], id);
        q_empty(gen, x[14], id);
    };
    Y.set_questions(q);
}

export function x4s21(shuffle = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]) {
    let q = function (gen = false, id = "rand") {
        let x = shuffle.map(String);
        id += x[0] + "M";
        q_activate_ltu_nn(gen, x[0], id);
        q_test_accuracy(gen, x[1], id);
        q_kernel_1d(gen, x[2], id);
        q_slack_value(gen, x[3], id, 2);
        q_binary_bayes_net(gen, x[4], id, "A<-B->C");
        q_bayes_net_train(gen, x[5], id);
        q_hinge_gradient(gen, x[6], id);
        q_markov_trip(gen, x[7], id);
        q_count_weight_cnn(gen, x[8], id, true);
        q_svm_transform(gen, x[9], id);
        q_max_tree_accuracy(gen, x[10], id);
        q_joint_table(gen, x[11], id);
        q_hmm(gen, x[12], id);
        q_reinforce(gen, x[13], id);
        q_empty(gen, x[14], id);
    };
    Y.set_questions(q);
}

export function load_exams() {
    Y.set_global("exams", "1A", x1s21);
    Y.set_global("points", "1A", [4, 2, 3, 4, 2, 3, 2, 4, 4, 4, 4, 4, 3, 3, 1]);
    Y.set_global("exams", "1B", x2s21);
    Y.set_global("points", "1B", [4, 2, 3, 4, 2, 3, 2, 4, 2, 4, 2, 4, 3, 3, 1]);
    Y.set_global("exams", "2A", x3s21);
    Y.set_global("points", "2A", [4, 1, 4, 2, 3, 2, 2, 4, 4, 4, 2, 3, 5, 4, 1]);
    Y.set_global("exams", "2B", x4s21);
    Y.set_global("points", "2B", [4, 2, 4, 2, 3, 2, 4, 3, 4, 4, 3, 3, 5, 4, 1]);
}
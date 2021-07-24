function f1as20c(shuffle = [0]) {
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
    set_questions(q);
}

function f2as20c(shuffle = [0]) {
    let q = function (gen = false, id = "rand") {
        let x = shuffle.map(String);
        id += x[0];
        q_quick_tree(gen, x[0], id);
        q_h_admissible_list(gen, x[1], id, 6, true);
        q_h_admissible_list(gen, x[2], id + "0", 6, false);
        q_hill_random(gen, x[3], id);
        q_alpha_beta_range(gen, x[4], id, -1, [3, 5], false, false);
        q_chance_game(gen, x[5], id, true);
        q_cts_mix_game(gen, x[6], id, true);
        q_highway(gen, x[7], id);
        q_donate_game(gen, x[8], id);
        q_empty(gen, "10", id);
    };
    set_questions(q);
}

function f2bs20c(shuffle = [0]) {
    let q = function (gen = false, id = "rand") {
        let x = shuffle.map(String);
        id += x[0];
        q_integer_search(gen, x[0], id);
        q_large_tree_search(gen, x[1], id, "dfs");
        q_graph_to_search(gen, x[2], id, "ids", 8);
        q_genetic_cross(gen, x[3], id, 4, 4);
        q_alpha_beta_range(gen, x[4], id, -1, [3, 5], true, false);
        q_chance_game(gen, x[5], id, false);
        q_cts_mix_game(gen, x[6], id, false);
        q_highway(gen, x[7], id);
        q_donate_game(gen, x[8], id);
        q_empty(gen, "10", id);
    };
    set_questions(q);
}

function f1as20e(shuffle = [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    let q = function (gen = false, id = "rand") {
        shuffle = [0];
        let x = shuffle.map(String);
        id += x[0];
        q_cluster_given(gen, "1", id, 5, true);
        q_cluster_given(gen, "2", id, 5, false);
        q_switch_on_off(gen, "3", id);
        q_vaccine(gen, "4", id);
        q_quick_tree(gen, "5", id);
        q_max_mix(gen, "6", id, true);
        q_max_mix(gen, "7", id, false);
        q_highway(gen, "8", id);
        q_proj_var(gen, "9", id, 3);
        q_large_tree_search(gen, "10", id, "bfs");
        q_large_tree_search(gen, "11", id, "dfs");
        q_chance_game(gen, "12", id, true);
        q_chance_game(gen, "13", id, false);
        q_cts_mix_game(gen, "14", id, true);
        q_cts_mix_game(gen, "15", id, false);
        //q_a_star_search(gen, "16", id);
        //q_a_star_grid(gen, "17", id);
        q_local_1d_search(gen, "18", id, false);
        q_pd_game(gen, "19", id);
        q_reorder_prune(gen, "20", id, [3, 3], true);
        q_crime_report(gen, "21", id);
        q_donate_game(gen, "22", id);
        q_empty(gen, "23", id);
    };
    set_questions(q);
}
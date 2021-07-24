// jshint esversion: 6
// @ts-check

import * as Y from "./YJS.js";
import * as X from "./CS540.js";

export function x1s21(shuffle = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]) {
    let q = function (gen = false, id = "rand") {
        let x = shuffle.map(String);
        id += x[0];
        X.q_ltu_update(gen, x[0], id, 1);
        X.q_sigmoid_inverse(gen, x[1], id);
        X.q_entropy_constant(gen, x[2], id);
        X.q_knn_decision(gen, x[3], id, 6, 3);
        X.q_root_gram(gen, x[4], id);
        X.q_bayes_rule(gen, x[5], id, ["A", "B"], ["H", "T"], 3);
        X.q_smoothing(gen, x[6], id);
        X.q_svm_full_support(gen, x[7], id, 3, true);
        X.q_pooling(gen, x[8], id);
        X.q_two_cdf(gen, x[9], id);
        X.q_knn_vowel(gen, x[10], id);
        X.q_var_reduce(gen, x[11], id);
        X.q_knn_last(gen, x[12], id);
        X.q_children_boy(gen, x[13], id);
        X.q_empty(gen, x[14], id);
    };
    Y.set_questions(q);
}

export function x3s21(shuffle = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]) {
    let q = function (gen = false, id = "rand") {
        let x = shuffle.map(String);
        id += x[0];
        X.q_ltu_update(gen, x[0], id, 1);
        X.q_rlu_inverse(gen, x[1], id);
        X.q_entropy(gen, x[2], id);
        X.q_knn_vowel(gen, x[3], id);
        X.q_root_gram(gen, x[4], id);
        X.q_bayes_rule(gen, x[5], id, ["A", "B"], ["H", "T"], 3);
        X.q_word_mle(gen, x[6], id);
        X.q_svm_full_support(gen, x[7], id, 3, false);
        X.q_gradient_direction(gen, x[8], id);
        X.q_two_cdf(gen, x[9], id);
        X.q_max_entropy(gen, x[10], id);
        X.q_var_reduce(gen, x[11], id);
        X.q_knn_last(gen, x[12], id);
        X.q_children_boy(gen, x[13], id);
        X.q_empty(gen, x[14], id);
    };
    Y.set_questions(q);
}

export function x2s21(shuffle = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]) {
    let q = function (gen = false, id = "rand") {
        let x = shuffle.map(String);
        id += x[0];
        X.q_activate_ltu_nn(gen, x[0], id);
        X.q_flip_accuracy(gen, x[1], id);
        X.q_svm_kernel_sum(gen, x[2], id);
        X.q_slack_value(gen, x[3], id, 2);
        X.q_binary_bayes_net(gen, x[4], id, "A->B->C");
        X.q_bayes_net_train(gen, x[5], id);
        X.q_sub_grad(gen, x[6], id);
        X.q_skip_markov_chain(gen, x[7], id);
        X.q_count_weight_cnn(gen, x[8], id, false);
        X.q_svm_transform(gen, x[9], id);
        X.q_min_knn(gen, x[10], id);
        X.q_feature_range(gen, x[11], id);
        X.q_hmm(gen, x[12], id);
        X.q_reinforce(gen, x[13], id);
        X.q_empty(gen, x[14], id);
    };
    Y.set_questions(q);
}

export function x4s21(shuffle = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]) {
    let q = function (gen = false, id = "rand") {
        let x = shuffle.map(String);
        id += x[0];
        X.q_activate_ltu_nn(gen, x[0], id);
        X.q_test_accuracy(gen, x[1], id);
        X.q_kernel_1d(gen, x[2], id);
        X.q_slack_value(gen, x[3], id, 2);
        X.q_binary_bayes_net(gen, x[4], id, "A<-B->C");
        X.q_bayes_net_train(gen, x[5], id);
        X.q_hinge_gradient(gen, x[6], id);
        X.q_markov_trip(gen, x[7], id);
        X.q_count_weight_cnn(gen, x[8], id, true);
        X.q_svm_transform(gen, x[9], id);
        X.q_max_tree_accuracy(gen, x[10], id);
        X.q_joint_table(gen, x[11], id);
        X.q_hmm(gen, x[12], id);
        X.q_reinforce(gen, x[13], id);
        X.q_empty(gen, x[14], id);
    };
    Y.set_questions(q);
}


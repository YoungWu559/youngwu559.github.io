function g()
{
    // Variables
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    let total_width = canvas.width;
    let total_height = canvas.height;
    let grid_x = 10;
    let grid_y = 10;
    let layer = 4;
    let state = 6;
    let ground_layer = 0;
    let object_layer = 1;
    let character_layer = 2;
    let anti_character_layer = 3;
    let remove_state = 0;
    let x_change_state = 1;
    let y_change_state = 2;
    let character_state = 3;
    let x_fire_state = 4;
    let y_fire_state = 5;
    let grid_width = total_width / grid_x;
    let grid_height = total_height / grid_y;
    let grid_size = Math.min(grid_height, grid_width);
    let images = [];
    let board = [];
    let action = [];
    let anime = 1.0;
    let paths = [["big-wood-egg", "small-wood-egg", "three-iron-egg", "two-iron-egg", "one-iron-egg"], 
    ["bullbasaur", "charmander", "squirtle", "pikachu", "eevee"], 
    ["pokeball", "pokeball", "superball", "mega-ball"],
    ["meowth", "bad-boy", "bad-girl"]];
    let convert = [[[[0, 1], [0, 2]], [[1, 0], [2, 0]]],
    [[[1, 0], [2, 0], [3, 0]], [[0, 1], [0, 2], [0, 3]]],
    [[[-1, 0], [1, 0], [0, 1], [0, -1]], [[-1, 0], [1, 0], [0, 1], [0, 2]], [[-1, 0], [1, 0], [0, -1], [0, -2]], [[0, -1], [0, 1], [1, 0], [2, 0]], [[0, -1], [0, 1], [-1, 0], [-2, 0]]],
    [[[1, 0], [2, 0], [3, 0], [4, 0]], [[0, 1], [0, 2], [0, 3], [0, 4]]]];
    let scale = [1, 0.75, 1, 1];

    // Main Functions
    function initialize()
    {
        load_images();
        for (let x = 0; x < grid_x; x ++)
        {
            board[x] = [];
            action[x] = [];
            for (let y = 0; y < grid_y; y ++)
            {
                board[x][y] = [];
                action[x][y] = [];
                for (let z = 0; z < state; z ++) action[x][y][z] = 0;
                for (let z = 0; z < layer; z ++) board[x][y][z] = 0;
                if (Math.random() < 0.2) 
                {
                    board[x][y][ground_layer] = Math.floor(Math.random() * paths[ground_layer].length + 1);
                }
                else 
                {
                    if (Math.random() < 0.9) board[x][y][object_layer] = Math.floor(Math.random() * paths[object_layer].length + 1);
                    else board[x][y][anti_character_layer] = Math.floor(Math.random() * paths[anti_character_layer].length + 1);
                }
            }
        }
    }

    function load_images()
    {
        let path = "";
        for (let z = 0; z < paths.length; z ++)
        {
            images[z] = [];
            for (let t = 0; t < paths[z].length; t ++)
            {
                path = "Icons/" + paths[z][t] + ".png";
                images[z][t] = new Image();
                images[z][t].src = path;
            }
        }
    }
    
    function draw_object(x = 0, y = 0, z = 0, t = 0)
    {
        if (t != 0)
        {
            let x0 = (x + 0.5) * grid_width;
            let y0 = (y + 0.5) * grid_height;
            let r0 =  0.5 * grid_size * scale[z];
            if (action[x][y][remove_state] > 0) r0 = r0 * anime;
            if (action[x][y][x_change_state] != 0 || action[x][y][y_change_state] != 0)
            {
                x0 += (1 - anime) * grid_width * action[x][y][x_change_state];
                y0 += (1 - anime) * grid_height * action[x][y][y_change_state];
            }
            draw_image_fast(context, images[z][t - 1], x0 - r0, y0 - r0, x0 + r0, y0 + r0);
        }
    }

    function draw_action(x = 0, y = 0, z = 0, t = 0)
    {
        if (t != 0 && z == remove_state)
        {
            let x0 = (x + 0.5) * grid_width;
            let y0 = (y + 0.5) * grid_height;
            let r0 =  0.5 * grid_size;
            let c0 = "";
            if (t == 4) c0 = "black";
            else if (t == 3) c0 = "yellow";
            else if (t == 2) c0 = "red";
            else if (t == 1) c0 = "green";
            draw_rectangle(context, x0 - r0, y0 - r0, x0 + r0, y0 + r0, "", c0);
        }
    }

    function fill_action(x = 0, y = 0, z = 0, e = 0, t = 0, q = 0)
    {
        if (x > -1 && x < board.length && y > -1 && y < board[x].length && action[x][y][t] < q && board[x][y][z] == e)
        {
            action[x][y][t] = q;
            fill_action(x + 1, y, z, e, t, q);
            fill_action(x - 1, y, z, e, t, q);
            fill_action(x, y + 1, z, e, t, q);
            fill_action(x, y - 1, z, e, t, q);
        }
    }
    
    function drop_action(x = 0, y = 0)
    {
        let drop = 1;
        if (y > 0)
        {
            let x0 = 0;
            for (let c = -1; c <= 1 ; c ++)
            {
                x0 = x + c;
                if (x0 >= 0 && x0 <= grid_x - 1 && (board[x0][y - 1][object_layer] > 0 || board[x0][y - 1][character_layer] > 0 || board[x0][y - 1][anti_character_layer] > 0))
                {
                    action[x0][y - 1][x_change_state] = -c;
                    action[x0][y - 1][y_change_state] = 1;
                    drop = 0;
                    break;
                }
            }
        }
        else
        {
            board[x][y][object_layer] = Math.floor(Math.random() * paths[object_layer].length + 1);
            drop = 0;
        }
        if (drop == 1) anime = 1.0;
        return drop;
    }

    function check_board(x = 0, y = 0, z = 1, d = [[]])
    {
        let temp = board[x][y][z];
        for (let i = 0; i < d.length; i ++)
        {
            if (x + d[i][0] < 0 || x + d[i][0] > board.length - 1) return false;
            else if (y + d[i][1] < 0 || y + d[i][1] > board[x + d[i][0]].length - 1) return false;
            else if (board[x + d[i][0]][y + d[i][1]][z] != temp) return false;
        }
        return true;
    }

    function clear_action()
    {
        for (let x = 0; x < grid_x; x ++)
        {
            for (let y = 0; y < grid_y; y ++)
            {
                if (action[x][y][remove_state] > 0)
                {
                    board[x][y][object_layer] = 0;
                    action[x][y][remove_state] = 0;
                }
                if (action[x][y][x_change_state] != 0 || action[x][y][y_change_state] != 0)
                {
                    for (let z = 0; z < layer; z ++)
                    {
                        board[x + action[x][y][x_change_state]][y + action[x][y][y_change_state]][z] = board[x][y][z];
                        board[x][y][z] = 0;
                    }
                    action[x][y][x_change_state] = 0;
                    action[x][y][y_change_state] = 0;
                }
                if (action[x][y][character_state] > 0)
                {
                    if (action[x][y][character_state] > 1) board[x][y][character_layer] = action[x][y][character_state];
                    action[x][y][character_state] = 0;
                }
                if (action[x][y][x_fire_state] > 0 || action[x][y][y_fire_state] > 0)
                {
                    if (in_bound(x + action[x][y][x_fire_state], y + action[x][y][y_fire_state]))
                    {
                        board[x + action[x][y][x_fire_state]][y + action[x][y][y_fire_state]][character_layer] = board[x][y][character_layer];
                        board[x + action[x][y][x_fire_state]][y + action[x][y][y_fire_state]][object_layer] = 0;
                        board[x][y][character_layer] = 0;
                        action[x + action[x][y][x_fire_state]][y + action[x][y][y_fire_state]][x_fire_state] = action[x][y][x_fire_state];
                        action[x + action[x][y][x_fire_state]][y + action[x][y][y_fire_state]][y_fire_state] = action[x][y][y_fire_state];
                        action[x][y][x_fire_state] = 0;
                        action[x][y][y_fire_state] = 0;
                    }
                }
            }
        }
    }

    function update_action()
    {
        anime = 0;
        clear_action();
        let finished_drop = 1;
        for (let x = 0; x < grid_x; x ++)
        {
            for (let y = 0; y < grid_y; y ++)
            {
                if (board[x][y][ground_layer] == 0 && board[x][y][object_layer] == 0 && board[x][y][character_layer] == 0 && board[x][y][anti_character_layer] == 0) finished_drop *= drop_action(x, y);
            }
        }
        if (finished_drop == 1)
        {
            for (let x = 0; x < grid_x; x ++)
            {
                for (let y = 0; y < grid_y; y ++)
                {
                    if (board[x][y][object_layer] != 0)
                    {
                        let found = false;
                        for (let i = convert.length - 1; i >= 0 && !found; i --)
                        {
                            for (let j = 0; j < convert[i].length && !found; j ++)
                            {
                                if (check_board(x, y, object_layer, convert[i][j])) 
                                {
                                    fill_action(x, y, object_layer, board[x][y][object_layer], remove_state, i + 1);
                                    action[x][y][character_state] = i + 1;
                                    found = true;
                                }
                            }
                        }
                    }
                }
            }
        }
        anime = 1.0;
    }

    function draw_board()
    {
        context.clearRect(0, 0, total_width, total_height);
        for (let x = 0; x <= grid_x; x ++) draw_line(context, x * grid_width, 0, x * grid_width, total_height);
        for (let y = 0; y <= grid_y; y ++) draw_line(context, 0, y * grid_height, total_width, y * grid_height);    
        for (let x = 0; x < grid_x; x ++)
        {
            for (let y = 0; y < grid_y; y ++)
            {
                for (let z = 0; z < state; z ++) draw_action(x, y, z, action[x][y][z]);
                for (let z = 0; z < layer; z ++) draw_object(x, y, z, board[x][y][z]);
            }
        }
        let dt = 0.25;
        if (anime > dt) anime -= dt;
        else update_action();
        requestAnimationFrame(draw_board);
    }

    function can_swap (i0 = 0, j0 = 0, i1 = 0, j1 = 0)
    {
        if (Math.abs(i0 - i1) + Math.abs(j0 - j1) != 1) return false;
        if (board[i0][j0][ground_layer] != 0 || board[i1][j1][ground_layer] != 0 || board[i0][j0][character_layer] != 0 || board[i1][j1][character_layer] != 0  || board[i0][j0][anti_character_layer] != 0 || board[i1][j1][anti_character_layer] != 0) return false;
        return true;
    }

    function can_fire (i0 = 0, j0 = 0, i1 = 0, j1 = 0)
    {
        if (Math.abs(i0 - i1) + Math.abs(j0 - j1) != 1) return false;
        if (board[i1][j1][character_layer] == 0) return false;
        return true;
    }

    function in_bound (i0 = -1, i1 = -1)
    {
        return !(i0 < 0 || i0 > grid_x - 1 || i1 < 0 || i1 > grid_y - 1);
    }

    initialize();
    update_action();
    draw_board();

    // Mouse Events
    let mouseX = -1;
    let mouseY = -1;
    let new_mouseX = -1;
    let new_mouseY = -1;

    sync_touch(canvas);

    canvas.onmousedown = function(event)
    {
        let box = canvas.getBoundingClientRect();
        mouseX = Math.floor((event.clientX - box.left) / grid_width);
        mouseY = Math.floor((event.clientY - box.top) / grid_height);
    };

    canvas.onmouseup = function(event)
    {
        let box = canvas.getBoundingClientRect();
        new_mouseX = Math.floor((event.clientX - box.left) / grid_width);
        new_mouseY = Math.floor((event.clientY - box.top) / grid_height);
        if (can_swap(mouseX, mouseY, new_mouseX, new_mouseY))
        {
            let cur = board[mouseX][mouseY][object_layer];
            board[mouseX][mouseY][object_layer] = board[new_mouseX][new_mouseY][object_layer];
            board[new_mouseX][new_mouseY][object_layer] = cur;
            update_action();
        }
        else if (can_fire(mouseX, mouseY, new_mouseX, new_mouseY))
        {
            let type = board[mouseX][mouseY][character_layer];
            if (type == 1)
            {
                board[new_mouseX][new_mouseY][character_layer] = board[mouseX][mouseY][character_layer];
                action[new_mouseX][new_mouseY][x_fire_state] = new_mouseX - mouseX;
                action[new_mouseX][new_mouseY][y_fire_state] = new_mouseY - mouseY;
            }
            else
            {
                for (let i = -1; i <= 1; i += 2)
                {
                    if (in_bound(new_mouseX + i, new_mouseY))
                    {
                        board[new_mouseX + i][new_mouseY][character_layer] = board[mouseX][mouseY][character_layer];
                        action[new_mouseX + i][new_mouseY][x_fire_state] = i;
                    }
                    if (in_bound(new_mouseX, new_mouseY + i))
                    {
                        board[new_mouseX][new_mouseY + i][character_layer] = board[mouseX][mouseY][character_layer];
                        action[new_mouseX][new_mouseY + i][y_fire_state] = i;
                    }
                }
            }
            board[mouseX][mouseY][character_layer] = 0;
            update_action();
        }
    };
}
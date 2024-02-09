require('dotenv').config();
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const {Sequelize, DataTypes, Op} = require("sequelize");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const sequelize = new Sequelize(process.env.DB_NAME, process.env.USER_NAME, process.env.PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mssql',
    logging: false
});
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

const Anime = sequelize.define("animes", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    episodes: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    aired: {
        type: DataTypes.STRING,
        allowNull: true
    },
    stid: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    synopsis: {
        type: DataTypes.STRING,
        allowNull: true
    }},
    {
        tableName: "animes",
        timestamps: false
    }
);

const Genres = sequelize.define("genres", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }}, 
    {
        tableName: "genres",
        timestamps: false
    }
);

const Anime_genres = sequelize.define("anime_genre", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    gid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    aid: {
        type: DataTypes.INTEGER,
        allowNull: false
    }},
    {
        tableName: "anime_genre",
        timestamps: false
    }
);

const Studios = sequelize.define("studios", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }}, 
    {
        tableName: "studios",
        timestamps: false
    }
);

const Producers = sequelize.define("producers", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, 
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }},
    {
        tableName: "producers",
        timestamps: false
    }
);

const Anime_producers = sequelize.define("anime_producer", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    pid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    aid: {
        type: DataTypes.INTEGER,
        allowNull: false
    }},
    {
        tableName: "anime_producer",
        timestamps: false
    }
);

const Characters = sequelize.define("characters", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, 
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    vaid: {
        type: DataTypes.INTEGER,
        allowNull: true
    }},
    {
        tableName: "characters",
        timestamps: false
    }    
);

const Anime_characters = sequelize.define("anime_character", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, 
    chid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    aid: {
        type: DataTypes.INTEGER,
        allowNull: false
    }},
    {
        tableName: "anime_character",
        timestamps: false
    }    
);

const Voice_actors = sequelize.define("voice_actors", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, 
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: true
    }},
    {
        tableName: "voice_actors",
        timestamps: false
    }    
);

const Comments = sequelize.define("comments", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    aid: {
        type: DataTypes.INTEGER,
        allowNull: false
    }},
    {
        tableName: "comments",
        timestamps: false
    }
);

Studios.hasMany(Anime, { foreignKey: 'stid' });
Anime.belongsTo(Studios, { foreignKey: 'stid' });

Anime.hasMany(Comments, { foreignKey: 'aid' });
Comments.belongsTo(Anime, { foreignKey: 'aid' });

Producers.belongsToMany(Anime, {
    through: Anime_producers,
    foreignKey: 'pid'
});

Anime.belongsToMany(Producers, {
    through: Anime_producers,
    foreignKey: 'aid'
});

Genres.belongsToMany(Anime, {
    through: Anime_genres,
    foreignKey: 'gid'
});

Anime.belongsToMany(Genres, {
    through: Anime_genres,
    foreignKey: 'aid'
});

Characters.belongsToMany(Anime, {
    through: Anime_characters,
    foreignKey: 'chid'
});

Anime.belongsToMany(Characters, {
    through: Anime_characters,
    foreignKey: 'aid'
});

Voice_actors.hasMany(Characters, { foreignKey: 'vaid' });
Characters.belongsTo(Voice_actors, { foreignKey: 'vaid' });

async function ListAnime(type) {
    let order = 'rating';
    let filter = {
        
    };
    if (type == 'Movies') {
        filter = {
            'episodes': 1,
        }
    } else if (type == 'Aired') {
        order = 'aired';
    } else if (type == 'TV Series') {
        filter = {
            'episodes': { [Op.ne]: 1 },
        }
    } else {
        order = 'aired';
    }

    const animes = await Anime.findAll({
        include: [
            {
                model: Producers,
                attributes: ['name'],
                through: {
                    attributes: []
                }
            },
            {
                model: Studios,
                attributes: ['name']
            },
            {
                model: Genres,
                attributes: ['name'],
                through: {
                    attributes: []
                }
            }
        ],
        attributes: [['id', 'key'], 'name', 'image', 'episodes', 'aired', 'rating'],
        order: [
            [order, 'DESC']
        ],
        where: filter
    });

    return animes;
}

async function GetAnime(name) {
    const animes = await Anime.findAll({
        where: {
            name: name
        },
        include: [
            {
                model: Producers,
                attributes: ['name'],
                through: {
                    attributes: []
                }
            },
            {
                model: Studios,
                attributes: ['name']
            },
            {
                model: Genres,
                attributes: ['name'],
                through: {
                    attributes: []
                }
            },
            {
                model: Characters,
                attributes: ['name', 'image'],
                through: {
                    attributes: []
                },
                include: {
                    model: Voice_actors,
                    attributes: ['name', 'image']
                }
            },
            {
                model: Comments,
                attributes: [['user_name', 'author'], ['comment', 'content']]
            }
        ],
        attributes: [['id', 'key'], 'name', 'title', 'image', 'episodes', 'aired', 'rating', 'synopsis']
    });

    return animes;
}

async function AddComment(data) {
    let newComment = await Comments.create({
        user_name: data.author,
        comment: data.content,
        aid: data.key
    });
}

app.get('/api/test', (req, res) => {
    res.json({ message: 'I am a message from Server!'});
});

app.post('/api/list', async (req, res) => {
    let data = await ListAnime(req.body.type);
    res.json({ data: data });
});

app.post('/api/getDetail', async (req, res) => {
    let data = await GetAnime(req.body.name);
    res.json({ data: data });
});

app.post('/api/addComment', async (req, res) => {
    let data = await AddComment(req.body.data);
});

app.post('/api/delComment', async (req, res) => {
    let data = JSON.parse(fs.readFileSync("./data.json"));
    data.push(req.body.data);
    fs.writeFileSync("./data.json", JSON.stringify(data, null, '\t'));
});

/*
app.post('/api/insert', function(req, res) {
    var sql = "INSERT "
            + "INTO users(name, password, email, ten, sdt, cmnd, ngaysinh, thangsinh, namsinh, khoi_id, cap1, cap2) "
            + "VALUES('"
            + req.body.name + "','" 
            + req.body.password + "','" 
            + req.body.email + "','"
            + "' '" + "','"
            + "' '" + "','"
            + "' '" + "','"
            + "0" + "','"
            + 0 + "','"
            + 0 + "','"
            + 0 + "','"
            + 0 + "','"
            + 0 + "')";
    connection.query(sql, function (err, results) {
        if(err) throw err;
        sql = "SELECT * FROM roles";
        connection.query(sql, function (err, results) {
            if (err) {
                throw err;
            }
            results.some((value, index) => {
                if (req.body.role == value.name) {
                    var userID = 0;
                    var roleID = value.id;

                    sql = "SELECT id, name FROM users";
                    connection.query(sql, function (err, results) {
                        if (err) {
                            throw err;
                        }
                        results.some((value, index) => {
                            if (req.body.name == value.name) {
                                userID = value.id;
                                sql = "INSERT "
                                    + "INTO role_user(user_id, role_id) "
                                    + "VALUES('"
                                    + userID + "','" 
                                    + roleID + "')";
                                connection.query(sql, function (err, results) {
                                    if(err) throw err;
                                    res.json({users: results});
                                });
                            }
                        });
                    });
                }
            });
        });
    });
});

app.post('/api/edit', (req, res) => {
    var sql = "UPDATE users SET "
            + "name='" + req.body.name + "',"
            + "password='" + req.body.password + "',"
            + "email='" + req.body.email + "'"
            + "WHERE id='" + req.body.id + "'";
    connection.query(sql, function(err, results) {
        if (err) throw err;
        sql = "SELECT * FROM roles";
        connection.query(sql, function (err, results) {
            if (err) {
                throw err;
            }
            results.some((value, index) => {
                if (req.body.role == value.name) {
                    console.log(value.name + value.id);
                    sql = "UPDATE role_user SET "
                        + "role_id='" + value.id + "'"
                        + "WHERE user_id='" + req.body.id + "'";
                    connection.query(sql, function (err, results) {
                        if (err) {
                            throw err;
                        }
                        res.json({users: results});
                    });
                }
            });
        });
    });
});

app.post('/api/delete', (req, res) => {
    var sql = "DELETE FROM users "
            + "WHERE id='" + req.body.id + "'";
    connection.query(sql, function(err, results) {
        if (err) throw err;
        sql = "DELETE FROM role_user "
            + "WHERE user_id='" + req.body.id + "'";
        connection.query(sql, function(err, results) {
            if (err) {
                throw err;
            }
            res.json({users: results});
        })
    });
});
*/

app.listen(4000, () => console.log('App listening on port 4000'));
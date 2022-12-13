// const { Client} = require("pg");
// const dotenv = require("dotenv");
// dotenv.config({ path: __dirname + "/.env" });

// exports.connect_Db = async () => {
//     try {
//         // .env variables pulled in automatically by pg
//         const client = new Client();
//         await client.connect((err) => {
//             if (err) {
//                 console.error(err);
//                 client.end();
//             } else {
//                 console.log("Connected to db: ", process.env.PGDATABASE);
//             };
//         });
//         const res = await client.query("SELECT * FROM tasks");
//         console.log(res.fields);

//         // await client.end();
//     } catch (err) {
//         console.error(err);
//     };

// };

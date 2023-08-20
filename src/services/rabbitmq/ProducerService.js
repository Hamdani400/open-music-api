const amqp = require("amqplib");
const { Pool } = require("pg");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");

const pool = new Pool();

const ProducerService = {
  sendMessage: async (queue, message) => {
    const parsedMessage = JSON.parse(message);
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [parsedMessage.playlistId],
    };
    let ownerCheck;
    const checkResult = await pool.query(query);
    if (!checkResult?.rows?.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    } else {
      ownerCheck = checkResult?.rows?.every(
        (i) => i.owner === parsedMessage.userId
      );
    }
    if (!ownerCheck) {
      throw new AuthorizationError("Anda tidak berhak mengekspor playlist ini");
    }

    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, {
      durable: true,
    });

    await channel.sendToQueue(queue, Buffer.from(message));

    setTimeout(() => {
      connection.close();
    }, 1000);
  },
};

module.exports = ProducerService;

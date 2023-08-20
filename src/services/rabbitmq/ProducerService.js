const amqp = require("amqplib");
const { Pool } = require("pg");
const PlaylistsServices = require("../postgres/PlaylistsService");

const playlistServices = new PlaylistsServices();

const ProducerService = {
  sendMessage: async (queue, message) => {
    const parsedMessage = JSON.parse(message);

    await playlistServices.verifyPlaylistOwner(
      parsedMessage.playlistId,
      parsedMessage.userId
    );

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

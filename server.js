const { Client, Intents, MessageEmbed } = require("discord.js");
const token = "OTYyNzYzNDYxODQ1MjE3MzAw.YlMRWA.YjaG2w4nNXkjJxE5ioy6W1X7m9Y";
const https = require("https")

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

client.once("ready", () => {
	console.log("Ready!");
});

client.on("messageCreate", (message) => {
    const messageSplit = message.content.split(" ")

    if (messageSplit[0] === "$weather") {
        var city = "";
        for (let i = 1; i < messageSplit.length; i++) {
            if (i + 1 === messageSplit.length) {
                city = city + messageSplit[i];
            } else {
                city = city + messageSplit[i] + " ";
            }
        }

        const query = city;
        const apiKey = "0adf8bf49972ff8e8d643c1b06088c08";
        const unit = "metric";
        const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

        https.get(url, (res) => {
            res.on("data", (data) => {
                const weatherData = JSON.parse(data);

                if (weatherData.cod === 200) {
                    const temp = weatherData.main.temp;
                    const tempFeelsLike = weatherData.main.feels_like
                    const humidity = weatherData.main.humidity;
                    const weatherMain = weatherData.weather[0].main;
                    const weatherDescription = weatherData.weather[0].description;
                    const weatherIcon = weatherData.weather[0].icon;
                    const iconUrl = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
    
                    const embed = new MessageEmbed();
                    embed.setColor("#0099ff");
                    embed.setTitle(query + " weather");
                    embed.setThumbnail(iconUrl);
                    embed.addField(weatherMain, weatherDescription);
                    embed.addField("Temperature", temp + " C");
                    embed.addField("Temperature feels like", tempFeelsLike + " C");
                    embed.addField("Humidity", humidity + "%");
                    embed.setTimestamp();
    
                    message.channel.send({ embeds: [embed] });
                } else {
                    const embed = new MessageEmbed();
                    embed.setColor("#0099ff");
                    embed.addField("Error code " + weatherData.cod, weatherData.message);
                    embed.setTimestamp();
    
                    message.channel.send({ embeds: [embed] });
                }
            });
        });
    }
});

client.login(token);

// OTYyNzYzNDYxODQ1MjE3MzAw.YlMRWA.YjaG2w4nNXkjJxE5ioy6W1X7m9Y
// https://discord.com/oauth2/authorize?client_id=962763461845217300&permissions=517544074304&scope=bot
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

const ownerIds = ['1203931944421949533', '1277996795225575515'];  // Replace with actual owner IDs

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverlist')
        .setDescription('Lists all servers the bot is in.')
        .addBooleanOption(option =>
            option.setName('hidden')
                .setDescription('Hide the response from other users')
                .setRequired(false)),

    async execute(interaction) {
        console.log('serverlist command executed');

        if (!ownerIds.includes(interaction.user.id)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        console.log('Permission check passed');

        const guilds = interaction.client.guilds.cache.map(guild => ({
            name: guild.name,
            owner: guild.ownerId,
            id: guild.id
        }));

        const maxPerPage = 10;
        let page = 0;

        const generateEmbed = (page) => {
            const start = page * maxPerPage;
            const end = start + maxPerPage;
            const pageGuilds = guilds.slice(start, end);

            const embed = new EmbedBuilder()
                .setTitle('Server List')
                .setDescription(pageGuilds.map(g => `**${g.name}**\nOwner: <@${g.owner}>\n[Invite](https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot&guild_id=${g.id}&response_type=code)`).join('\n\n'))
                .setFooter({ text: `Page ${page + 1} of ${Math.ceil(guilds.length / maxPerPage)}` });

            return embed;
        };

        const generateButtons = (page) => {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('previous')
                        .setLabel('Previous')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === 0),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled((page + 1) * maxPerPage >= guilds.length)
                );
            return row;
        };

        const ephemeral = interaction.options.getBoolean('hidden') || false;
        const message = await interaction.reply({ embeds: [generateEmbed(page)], components: [generateButtons(page)], ephemeral, fetchReply: true });

        const collector = message.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async i => {
            if (!ownerIds.includes(i.user.id)) return;

            if (i.customId === 'previous') {
                page--;
            } else if (i.customId === 'next') {
                page++;
            }

            await i.update({ embeds: [generateEmbed(page)], components: [generateButtons(page)] });
        });

        collector.on('end', async () => {
            try {
                await message.edit({ components: [] });
            } catch (error) {
                if (error.code !== 10008) {
                    console.error('Failed to edit message:', error);
                }
            }
        });
    },

    aliases: ['SL'],

    async executePrefixed(message) {
        console.log('serverlist command executed');

        if (!ownerIds.includes(message.author.id)) {
            return message.reply('You do not have permission to use this command.');
        }

        console.log('Permission check passed');

        const guilds = message.client.guilds.cache.map(guild => ({
            name: guild.name,
            owner: guild.ownerId,
            id: guild.id
        }));

        const maxPerPage = 10;
        let page = 0;

        const generateEmbed = (page) => {
            const start = page * maxPerPage;
            const end = start + maxPerPage;
            const pageGuilds = guilds.slice(start, end);

            const embed = new EmbedBuilder()
                .setTitle('Server List')
                .setDescription(pageGuilds.map(g => `**${g.name}**\nOwner: <@${g.owner}>\n[Invite](https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot&guild_id=${g.id}&response_type=code)`).join('\n\n'))
                .setFooter({ text: `Page ${page + 1} of ${Math.ceil(guilds.length / maxPerPage)}` });

            return embed;
        };

        const generateButtons = (page) => {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('previous')
                        .setLabel('Previous')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === 0),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled((page + 1) * maxPerPage >= guilds.length)
                );
            return row;
        };

        const msg = await message.channel.send({ embeds: [generateEmbed(page)], components: [generateButtons(page)] });

        const collector = msg.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async i => {
            if (!ownerIds.includes(i.user.id)) return;

            if (i.customId === 'previous') {
                page--;
            } else if (i.customId === 'next') {
                page++;
            }

            await i.update({ embeds: [generateEmbed(page)], components: [generateButtons(page)] });
        });

        collector.on('end', async () => {
            try {
                await msg.edit({ components: [] });
            } catch (error) {
                if (error.code !== 10008) {
                    console.error('Failed to edit message:', error);
                }
            }
        });
    },
};

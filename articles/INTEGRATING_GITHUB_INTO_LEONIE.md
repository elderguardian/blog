# Integrating GitHub into Leonie

![Result of the Issues Command](../assets/integrating-github-into-a-discord-bot.png)


The [Leonie Discord Bot](https://github.com/elderguardian/leonie) has just received a significant enhancement—an issue command. This means users can now view the [open issues](https://github.com/elderguardian/leonie/issues?q=is%3Aopen+is%3Aissue) in the bot repository using a straightforward command.

This article is about the implementation details of this feature, providing valuable insights into Leonie's framework.

## Creating a command
To implement the issue command in Leonie's framework, we start by creating an `IssueCommand.ts` file in the `commands/` directory. This file contains a Command Class that implements the `ICommand` interface.

```ts
export class IssuesCommand implements ICommand {
    getMetadata(): SlashCommandBuilder {
        return new SlashCommandBuilder()    
            .setName("issues")
            .setDescription("Get the current issues of this bot")
            .setDMPermission(true);
    }
    
    async run(runOptions: ICommandRunOptions, interaction: CommandInteraction): Promise<void> {
        //[...]
    }
}
```
This example Command Class defines an empty command that will not respond. However, it includes basic metadata for Discord to recognize it as a slash command. The `SlashCommandBuilder` provided by discord.js follows the Object-Oriented Builder pattern; it should be self-explanatory in terms of usage.

## Fetching issues from GitHub
To retrieve issues from GitHub, a software component was created, consisting of an `IGithubFetcher` interface and its implementation. The built-in DI-Container is configured to create an instance of this component, with the mapping added manually to the container under `src/core/ioc/Container.ts`.

```ts
//[...]
    await interaction.deferReply(); // Tell Discord: Hey, Computing this might take a while.

    const githubFetcher = kernel.get("IGithubFetcher");
    const issues: RepositoryIssues = await githubFetcher.fetchIssues("elderguardian", "leonie");
    const openIssues = issues.filter((issue) => issue.state === "open");

//[...]
```

## Responding with the data
Now we have everything to complete this setup. Remember that we will have to check if any issues even exist. In case none are open, we will respond with an error.

```ts
//[...]
    if (openIssues.length === 0) {
        await interaction.editReply({
            content: "There are currently no open issues.",
        });
        return;
    }
//[...]
```

In case there are issues, we build an embed and send it to the user. For that, we will have to create readable strings containing the wanted information:

```ts
//[...]
    const embedDescription = openIssues
        .map((issue) => `#${issue.number} | [${issue.title}](${issue.url}) by [${issue.author.name}](${issue.author.url})`)
        .join("\n");
//[...]
```

Finally, we can send an embed in a nice format:
```ts
//[...]
    const issueEmbed = new EmbedBuilder()
        .setColor(leonieConfig.embed_color)
        .setTitle(`Issues for elderguardian/leonie.`)
        .setURL("https://github.com/elderguardian/leonie/issues")
        .setDescription(embedDescription)
        .setFooter({ text: 'Support for GitHub users: elderguardian@tutanota.com' });

    await interaction.editReply({ embeds: [issueEmbed] });
//[...]
```

## Registering the Commands
Remember to register your commands on Discord before running the command using `npm run register-commands`.
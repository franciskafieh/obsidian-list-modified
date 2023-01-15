> Notice: development of this plugin is on hold until February as I am very busy with academics. This plugin is not abandoned.

# Obsidian List Modified

This plugin links all modified files meeting certain criteria to a daily note. This provides an accurate log/archive of files modified on certain days.

Example:

Using these settings... (must see on GitHub, this won't display on Obsidian)

![plugin settings](preview/settings-preview.png)

This is the result... (must see on GitHub, this won't display on Obsidian x2)

![plugin demo gif](preview/obsidian-list-modified.gif)

**PLEASE READ [THE (SHORT) WIKI](https://github.com/franciskafieh/obsidian-list-modified/wiki) BEFORE USING!**

# Why?

As of now, dataview queries cannot be "frozen" in time. There are hacky solutions using templater, but I wanted something really simple.

# How?

When a file is modified, the plugin checks if there is already a link to the modified file inside of your daily note. If so, it doesn't need to link it again. Otherwise, If this modified file meets the criteria, it appends a link to the daily note.

# Installation

**NOTE:** You must have safe mode shut off to be able to install community plugins such as this one!

## Community Plugin List (Recommended)

Simply search for "List Modified" on the community plugins browsing tab inside of Obsidian!

## Manual

1. Open your vault's folder in your file explorer
2. Make sure showing hidden files is enabled
3. Open the `.obsidian` folder, then open the `plugins` folder.
4. Create a new folder called `obsidian-list-modified`
5. Head over to the releases page and download the `manifest.json` and `main.js`
6. Add these files to the new folder you've created
7. Reload/restart Obsidian and enable the plugin in your community plugin settings

# Usage & Config

Please read [the wiki](https://github.com/franciskafieh/obsidian-list-modified/wiki).

# Disclaimer

This plugin should not do any harm, but **you should back up just in case**. I am not responsible for any damage!

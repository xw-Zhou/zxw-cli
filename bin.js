#!/usr/bin/env node

const inquirer = require('inquirer');
const program = require('commander');
const create=require('./lib/create.js');
const path= require('path');

const rootPath=path.resolve(__dirname);

program
    .command('create <app-name>')
    .description('Create a new project')
    .option('-f, --force', 'overwrite target directory if it exist')
    .action((name, options) => {
        create({
            name,
            options,
            rootPath
        })
    })

// program
//     .version(`v${require('./package.json').version}`)
//     .usage('<command> [option]')
program
    .version(`v${require('./package.json').version}`, '-v, --version', 'output the current version');

program.parse(process.argv);

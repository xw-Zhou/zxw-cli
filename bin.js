#!/usr/bin/env node

const inquirer = require('inquirer');
const program = require('commander');
const create=require('./lib/create.js')

// inquirer.prompt([
//     {
//         type:'input',
//         name:'name',
//         message:'请输入项目名称',
//         default:'default-name'
//     }
// ]).then(res=>{
//     console.log(res)
// })

program
    .command('create <app-name>')
    .description('Create a new project')
    .option('-f, --force', 'overwrite target directory if it exist')
    .action((name, option) => {
        // console.log(name, option)
        create(name, option)
    })

// program
//     .version(`v${require('./package.json').version}`)
//     .usage('<command> [option]')
program
    .version(`v${require('./package.json').version}`, '-v, --version', 'output the current version');

program.parse(process.argv);

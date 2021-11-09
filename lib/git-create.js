const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const { getRepoList } = require('../utils/getTemplate');
const ora = require('ora')
const chalk = require('chalk');
const util = require('util')
let downloadGitRepo = require('download-git-repo');

downloadGitRepo = util.promisify(downloadGitRepo)

async function getTemplateList() {
    const loading = ora('get template list...');
    loading.start();

    try {
        const { data } = await getRepoList();
        loading.succeed();
        return data;
    } catch (err) {
        loading.fail('get template list fail！')
    }
}

async function chooseTemplate(data) {
    if (!data || !data.length) {
        console.log(chalk.red('No template!'));
        return;
    }

    const list = data.map(item => {
        return {
            name: item.name,
            value: item.full_name
        }
    });

    const { temp } = await inquirer.prompt({
        name: 'temp',
        type: 'list',
        choices: list,
        message: 'Please choose a template to create project'
    })

    return temp;
}

async function downloadTemplate(templateName, targetDir) {
    const loading = ora('download template, please wait...');
    loading.start();

    try {
        await downloadGitRepo(templateName, targetDir)
        loading.succeed();
    } catch (err) {
        console.error(err);
        loading.fail('download template fail！');
    }

    // require('child_process').spawn('yarn', ['add','lodash'], {
    //     stdio: 'inherit',
    //     cwd: targetDir
    // })
}

module.exports=async function(targetDir){
    const templateList = await getTemplateList();
    const templateName = await chooseTemplate(templateList);
    await downloadTemplate(templateName, targetDir);
}
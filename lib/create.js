const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const ora = require('ora')
const chalk = require('chalk');
const gitCreate = require('./git-create.js');
const spawn = require('cross-spawn');


async function isOverwrite(options, targetDir) {
    if (options.force) {
        return true;
        // await fs.remove(targetDir)
    } else {
        const { action } = await inquirer.prompt([
            {
                name: 'action',
                type: 'list',
                message: 'Target directory already exists Pick an action:',
                choices: [
                    { name: 'overwrite', value: true },
                    { name: 'cancel', value: false }
                ]
            }
        ])
        return !!action;

        // if (action) {
        //     // await fs.remove(targetDir)
        // } else {
        //     return false;
        // }
    }
}

////////////////////////////////

async function getTemplateList() {
    const prefixPath = path.join(process.cwd(), './template');
    
    const files = await fs.readdir(prefixPath);

    const dirs = files.map(dir => {
        const dirPath = path.join(prefixPath, dir);
        let stat = fs.lstatSync(dirPath);
        if (stat.isDirectory()) {
            return {
                name: dir,
                full_name: dirPath
            }
        }
    }).filter(item => !!item);
    return dirs;
}

async function chooseTemplate(templateList) {
    if (!templateList || !templateList.length) {
        console.log(chalk.red('No template!'));
        return;
    }

    const list = templateList.map(item => {
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


async function copyTemplate(templateName, targetDir) {
    const { style } = await inquirer.prompt({
        name: 'style',
        type: 'list',
        choices: [
            { name: 'less', value: 'less' },
            { name: 'sass', value: 'sass' },
            { name: 'none', value: false }
        ],
        message: 'Please choose a loader'
    });

    const loading = ora('download template, please wait...');
    loading.start();

    // 复制模板
    try {
        await fs.remove(targetDir);
        await fs.copy(templateName, targetDir);
    } catch (err) {
        console.error(err);
        loading.fail('There are some errors！');
        return;
    }

    // 修改package.json文件
    if (style) {
        try {
            let obj = {
                "less": "^4.1.2",
                "less-loader": "^10.2.0"
            }
            const packageJSONPath = path.join(targetDir, './package.json');
            let package = await fs.readJSON(packageJSONPath);

            Object.assign(package['devDependencies'], obj);
            await fs.writeJson(packageJSONPath, package, { spaces: 2 });

        } catch (err) {
            loading.fail('There are some errors！');
            console.error(new Error(err))
            return;
        }
    }

    loading.succeed();
}

async function installDev(targetDir) {
    const { install } = await inquirer.prompt({
        name: 'install',
        type: 'list',
        choices: [
            { name: 'yes', value: true },
            { name: 'no', value: false }
        ],
        message: 'Do you want to install dependencies？'
    });

    if(install){
        spawn.sync('yarn', ['install'], { stdio: 'inherit',cwd:targetDir });
    }
}

module.exports = async function (name, options) {
    const cwd = process.cwd();
    const targetDir = path.join(cwd, name)

    // 如果目录存在，判断是否要覆盖
    if (fs.existsSync(targetDir)) {
        const res = await isOverwrite(options, targetDir);
        if (res === false) return;
    }

    // 模板放github上
    // await gitCreate(targetDir);
    // const templateList = await getTemplateList();
    // const templateName = await chooseTemplate(templateList);
    // await downloadTemplate(templateName, targetDir);

    // 模板放库里
    const templateList = await getTemplateList();
    const templateName = await chooseTemplate(templateList);
    await copyTemplate(templateName, targetDir);

    await installDev(targetDir);

    console.log(chalk.yellowBright(`\n Happy coding！\n`));
}   

// 模板放库里
// 1. 拷贝模板文件，修改package.json
// 2. 执行install

// 模板放github上
// 1. 从github拉模板，修改package.json
// 2. 执行install

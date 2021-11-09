
const axios = require('axios');
const inquirer=require('inquirer')


async function getRepoList() {
    return axios.get('https://api.github.com/orgs/zhurong-cli/repos')
}



module.exports={
    getRepoList
}
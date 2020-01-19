import arg from 'arg';
import inquirer from 'inquirer';
import {createProject} from './main';

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg({
        '--git':Boolean,
        '--yes': Boolean,
        '--install': Boolean
    },{
        argv: rawArgs.slice(2)
    });
    console.log('args ', args);

    return {
        skipPrompts: args['--yes'] || false,
        git: args['--git'] || false,
        template:args._[0],
        runInstall: args['--install'] || false
    }
}

async function promptForMissingOptions(options){
    const defaultTemplate = 'JavaScript';
    const questions = [];
    if(options.skipPrompts){
        return {
            ...options,
            template: options.template || defaultTemplate
        }
    }

    if(!options.template) {
        questions.push({
            type: 'list',
            name:'template',
            message: 'Please choose a template for the project',
            choices: ['JavaScript', 'Typescript'],
            default: defaultTemplate
        });
    }

    if(!options.git){
        questions.push({
            type:'confirm',
            name:'git',
            message: 'Initialize git repo ?',
            default: false
        })
    }

    const answers = await inquirer.prompt(questions);
    return {
        ...options,
        template: options.template || answers.template,
        git: options.git || answers.git
    };
}



 export async function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    console.log(options);
    await createProject(options);
}
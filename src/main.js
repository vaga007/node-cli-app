import chalk from 'chalk';
import ncp from 'ncp';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options){
    return copy(options.templateDirectory, options.targetDirectory,{
        clobber: false
    });

}

export async function createProject(options){
options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd()
    };
    const currentFileUrl = import.meta.url;    
    const pathname = new URL(currentFileUrl).pathname.charAt(0).replace(''); // FIX: this is temp fix for path generated with disk letter C:/ twice in the path
    const templateDir = path.normalize(path.resolve(
        pathname,
        '../../templates',
        options.template.toLowerCase()
    ));
    
    options.templateDirectory = templateDir;

    try{
        await access(templateDir, fs.constants.R_OK);
    }catch(err){
        console.error('%S Invalid template name ', err,chalk.red.bold('ERROR'));
        process.exit(1);
    }

    console.log('copy project files');
    await copyTemplateFiles(options);

    console.log('%s Project ready ', chalk.green.bold('DONE'));
}
import { Octokit } from "@octokit/core";
import dbConnect from "./dbConnect";
// import models from "@/models/models";

/*
    Input: 
        - owner: Owner of project
        - repo: Repo name
    Output: 
        Return contributor lists
*/
// https://github.com/ruiqidiaodrq/TEST3900
export async function gitContribution(owner: string, repo: string) {
    try {
        await dbConnect();
        
        const octokit = new Octokit({
            auth: process.env.GIT_TOKEN
        });
        
        const response = await octokit.request(`GET /repos/${owner}/${repo}/commits`, {
            owner: owner,
            repo: repo,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            },
        });
        
        const tempRecord = new Map();
        // const Student = models.Student;
        // Total contribution: commits and merge branch
        // Check if contributors is a student in the team
        // Need token, can create by developer
        // Need parameter: owner(not necessary contributor), repo
        // Student: add unique github username
        // Issue/Team add owner or repo 
        for (const commit of response.data) {
            if (commit.author) {
                // unique username
                const login = commit.author.login;
                // const student = Student.findOne({ username: login });

                if (!tempRecord.has(login)) {
                    tempRecord.set(login, {
                        login: login,
                        totalContribution: 1
                    });
                } else {
                    tempRecord.get(login).totalContribution += 1;
                }
            }
        }

        const contributorList = Array.from(tempRecord.values());
        
        return contributorList;
    } catch (error) {
        if (error instanceof Error) {
            console.log(error);
        }
    }
}


// export async function getContribution(issueId: string) {
//     try {
//         await dbConnect();
     
//         return;
//     } catch (error) {
//         if (error instanceof Error) {
//             console.log(error)
//         }
//     }
// }

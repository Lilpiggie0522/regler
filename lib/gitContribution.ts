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
export async function gitContribution(owner: string, repo: string) {
    try {
        await dbConnect();
        
        // Let student provide owner, repo by project owner and repo name
        // Please ensure one of your team member is project owner.
        // If one team member is project owner on github, provide 
        // project owner and repo will be beneficial for us to adjust.
        // token required and public repository only 
        // test? called by api? or directly by 
        // Or store github username in db and owner and repo, team, assignment?
        // store info cannot refresh
        // may need to distinguish initial issue and other issues.

        // 
        const octokit = new Octokit({
            auth: process.env.GIT_TOKEN
        })
        // send lecturer if tutor has submited a opinion, send student if lecturer closed/complete. Database, contribution

        // Contributors
        const response2 = await octokit.request(`GET /repos/${owner}/${repo}/contributors`, {
            owner: owner,
            repo: repo,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })
        const contributors = response2.data;
        console.log(contributors)
        
        // const Student = models.Student;

        const contributorList = [];
        for (const contributor of contributors) {
            // const student = await Student.findOne({ login: contributor.login });
            // if (!student) {
            //     console.log('Cannot find student given contributor login');
            //     continue
            // }
            // contributorList.push({
            //     login: contributor.login,
            //     id: contributor.id,
            //     totalCommits: contributor.contributions,
            //     studentName: student.studentName,
            //     zid: student.zid,
            // })

            contributorList.push({
                login: contributor.login,
                id: contributor.id,
                totalCommits: contributor.contributions,
                // studentName: 'Ruiqi Diao',
                // zid: 'z5361545',
            })
        }

        return contributorList;
    } catch (error) {
        if (error instanceof Error) {
            console.log(error)
        }
    }
}

export async function getContribution(issueId: string) {
    try {
        await dbConnect();
     
        return;
    } catch (error) {
        if (error instanceof Error) {
            console.log(error)
        }
    }
}

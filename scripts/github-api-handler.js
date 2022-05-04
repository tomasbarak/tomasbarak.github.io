async function getGithubFolders() {
    return new Promise((resolve, reject) => {
        getGithubTree().then(response => {
            response.json().then(data => {
                const folders = data.tree.filter(item => item.type === 'tree');
                resolve(folders);
            });
        })
    });
}

async function getGithubTree() {
    const github_username = 'tomasbarak';
    const github_repo = 'materias-5to';
    const github_branch = 'master'
    const recursive = 1;

    return new Promise((resolve, reject) => {
        fetch('https://api.github.com/repos/' + github_username + '/' + github_repo + '/git/trees/' + github_branch + '?recursive=' + recursive).then(response => {
            resolve(response);
        })
    });

}
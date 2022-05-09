function addFolder(name, { url, sha, path}){
    let target = document.getElementById('trabajos-folders');
    let newFolder = document.createElement('a');
    newFolder.classList.add('folder');
    newFolder.innerHTML = name;
    newFolder.href = path || '#';
    target.appendChild(newFolder);
}
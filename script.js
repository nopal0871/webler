// GANTI DENGAN URL VERCEL ANDA SETELAH DEPLOY
const BASE_URL = "https://back-2ujo.vercel.app"; 

async function fetchInfo() {
    const url = document.getElementById('videoUrl').value;
    const apiKey = document.getElementById('apiKey').value;
    const btn = document.getElementById('btnFetch');
    const loader = document.getElementById('loader');
    const result = document.getElementById('result');

    if(!url || !apiKey) return alert("Harap isi API Key dan URL Video!");

    loader.classList.remove('hidden');
    result.classList.add('hidden');
    btn.disabled = true;

    try {
        const response = await fetch(`${BASE_URL}/api/info?url=${encodeURIComponent(url)}`, {
            headers: { 'X-API-KEY': apiKey }
        });
        const data = await response.json();

        if(response.ok) {
            renderData(data);
        } else {
            alert("Error: " + (data.detail || "Terjadi kesalahan"));
        }
    } catch (e) {
        alert("Gagal koneksi ke server Backend!");
    } finally {
        loader.classList.add('hidden');
        btn.disabled = false;
    }
}

function renderData(data) {
    document.getElementById('result').classList.remove('hidden');
    document.getElementById('thumb').src = data.thumbnail;
    document.getElementById('title').innerText = data.title;
    document.getElementById('meta').innerText = `${data.source} • ${data.duration}`;

    const vSelect = document.getElementById('videoFormats');
    const aSelect = document.getElementById('audioFormats');
    vSelect.innerHTML = ""; aSelect.innerHTML = "";

    data.formats.forEach(f => {
        const label = `${f.resolution} (.${f.ext})`;
        const opt = `<option value="${f.url}">${label}</option>`;
        if(f.type === 'video') vSelect.innerHTML += opt;
        else aSelect.innerHTML += opt;
    });
}

function download(type) {
    const select = type === 'video' ? 'videoFormats' : 'audioFormats';
    const url = document.getElementById(select).value;
    if(url) window.open(url, '_blank');
}

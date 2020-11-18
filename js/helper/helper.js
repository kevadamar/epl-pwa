let currentTeam = null;
let currPage = window.location.hash.substr(1);

const showDetailTeam =  (id) => {
    var elems = document.querySelector(`.modal-${id}`);
    var insctance = M.Modal.init(elems);
    currentTeam = (currPage === "favorite" ? getFavByIdFromIDB(id) : getTeamsById(id))
    insctance.open()
}

const showDetailTeamFav = (id,modal = 1) => {
    var elems = document.querySelector(`.modal${modal}-${id}`);
    var insctance = M.Modal.init(elems);
    currentTeam = getFavByIdFromIDB(id)
    insctance.open()
    
}

const deleteDetailTeam = () => {
    var elms = document.querySelectorAll('.modal');
    M.Modal.init(elms)
}

const setNullCurrentTeam = () => {
    currentTeam = null
}

const generateFormatDate = (date) => {

    const days = [
        'Minggu',
        'Senin',
        'Selasa',
        'Rabu',
        'Kamis',
        'Jumat',
        'Sabtu'
      ]

      const dayName = days[new Date(date).getDay()]
      const getDate = new Date(date).getDate()
      const getMonth = new Date(date).getMonth() + 1
      const getHours = new Date(date).getHours()
      const getMinutes = new Date(date).getMinutes()
      const getYears = new Date(date).getFullYear()
      

    let Html = `
                    <div class="col s12">
                        ${dayName}, ${getDate}/${getMonth}/${getYears}
                    </div>
                    <div class="col s12">
                        ${getHours < 10 ? '0' + getHours : getHours}:${getMinutes < 10 ? '0' + getMinutes : getMinutes}
                    </div>
                `
    return Html;
}

const setLoadingDetail = () => {
    return `
    <div style="display:flex;justify-content: center;flex-direction: column;" id="loading">
        <p>
            <div class="preloader-wrapper big active" style="align-self: center;margin-top: 20vh;">
                <div class="spinner-layer spinner-blue-only">
                    <div class="circle-clipper left">
                        <div class="circle"></div>
                    </div>
                    <div class="gap-patch">
                        <div class="circle"></div>
                    </div>
                    <div class="circle-clipper right">
                        <div class="circle"></div>
                    </div>
                </div>
            </div>
        </p>
    </div>
    `
}

const checkDataFav =  async (id) => {
    await getById(parseInt(id)).then((res)=> {
        // console.log(res)
        if ((res !== null || res !== undefined)) {
            document.getElementById(`iconFav-${id}`).innerHTML = "star"
        } 
        if (res === undefined) {
            document.getElementById(`iconFav-${id}`).innerHTML = "star_border"
            document.getElementById(`iconFav-${id}`).addEventListener('click',() => {
                currentTeam = (currPage === "favorite" ? getFavByIdFromIDB(id) : getTeamsById(id))
                saveTeamToDB()
            })
        }
    })
}

const checkFavInIDB = async (id) => {
    let res = await getById(parseInt(id)).then((res)=> (!(res === null || res === undefined) ? true : false ));
    // console.log(res)
    return res
}

const saveAllTeams = (teams) => {
    // console.log(teams)
    saveTeamsCaches(teams)
}

const saveTeamToDB = () => {
        currentTeam.then(res => {
            // console.log(res)
            saveTeamToIDB(res);
        })
}

const deleteTeamToDB = (id) => {
    deleteTeamById(parseInt(id));
}

function showNotification(type){
    const title = `${type} Team Favorite`;
    const options = {
        "body": `Berhasil ${type} Team favorite`,
        "icon": "/assets/Premier_League_Logo.png",
        vibrate: [100, 50, 100]
    };
    if (Notification.permission === "granted"){
        navigator.serviceWorker.ready.then(reg => {
            reg.showNotification(title, options);
        });
    } else {
        console.error("Fitur Notification tidak di izinkan");
    }
}

// block view

const viewTeams = ({crestUrl,name,venue,id},index) => {
    // checkDataFav(id);
    return `
        <ul class="collection">
            <li class="collection-item avatar" onclick> 
                <img src="${crestUrl}" alt="${name}" class="circle" onError="this.onerror=null;this.src='/assets/alt-image.webp';">
                <span class="title">${name}</span>
                <p class="title" style="padding-top: 5px;font-size: 1.2em;font-weight: 600;">${!!venue ? venue : "-"}</p>
                <a href="#modal${index + 1}" onclick="showDetailTeam(${id})" class="modal-trigger secondary-content"><i class="material-icons">info</i></a>
                <a href="javascript:void(0);" class="modal-trigger secondary-content" style="top: 45px;"><i class="material-icons" id="iconFav-${id}"></i></a>
                <div id="modal${index + 1}" class="modal modal-${id} modal-fixed-footer">
                    <div class="modal-content grey lighten-2">
                        <div id="detailTeams-${id}" style="height:100%"></div>
                    </div>
                    <div class="modal-footer">
                        <a class="modal-close waves-effect waves-green btn-flat red-text" onclick="setNullCurrentTeam()">Close</a>
                    </div>
                </div>
            </li>
        </ul>
        `
}

const viewDetailTeams = ({name,crestUrl,address,email,website,phone}) => {
    return `
            <div class="col s12 m7">
                <h2 class="header black-text">${name}</h2>
                <div class="card horizontal grey lighten-2">
                    <div class="card-image">
                        <img src="${crestUrl}" style="padding: 4px 0 4px 0;" onError="this.onerror=null;this.src='/assets/alt-image.webp';">
                    </div>
                    <div class="card-stacked">
                        <div class="card-content">
                            <h5><i class="material-icons">contacts</i> More Info</h5>
                            <div>
                                <ul>
                                    <li>Alamat: ${address}</li>
                                    <li>Phone Number: ${phone}</li>
                                    <li>Email: ${email}</li>
                                    <li><a href="${website}" target="_blank">Website</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
}

const viewKlasemen = ({position,team,playedGames,won,draw,lost,goalsFor,goalsAgainst,goalDifference,points}) => {
    return `
            <tr>
                <td>${position}</td>
                <td><img src="${team.crestUrl}" onerror="" alt="${team.name}" height="50" class="circle" onError="this.onerror=null;this.src='/assets/alt-image.webp';"></td>
                <td>${team.name}</td>
                <td>${playedGames}</td>
                <td>${won}</td>
                <td>${draw}</td>
                <td>${lost}</td>
                <td>${goalsFor}</td>
                <td>${goalsAgainst}</td>
                <td>${goalDifference}</td>
                <td>${points}</td>
            </tr>`;
}

const viewSchedules = ({homeTeam,awayTeam,utcDate}) => {
    return `
            <div class="row">
                <div class="col s6">
                    <div class="row center" style="font-weight:bold;padding-top:20px;">
                        <div class="col s12">
                            ${homeTeam.name}
                        </div>
                        <div class="col s12">
                            VS
                        </div>
                        <div class="col s12">
                            ${awayTeam.name}
                        </div>
                    </div>
                </div>
                <div class="col s6">
                    <div class="row center" style="font-weight:bold;padding-top:20px;">
                            ${generateFormatDate(utcDate)}
                        </div>
                </div>
            </div>
            <hr>
                `;
}

// end block view
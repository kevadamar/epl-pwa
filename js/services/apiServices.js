const baseURLLigaInggris =
  "https://api.football-data.org/v2/competitions/2021/";
const TokenAPI = "83452d4a829a4ed985478fab6135ee92";

const BASE_URL = "https://api.football-data.org/v2/";

const fetchApi = function (url) {
  return fetch(url, {
    headers: {
      "X-Auth-Token": TokenAPI,
    },
  });
};

function status(response) {
  if (response.status !== 200) {
    console.log(`Error: ${response.status}`);
    return Promise.reject(new Error(response.statusText));
  } else {
    return Promise.resolve(response);
  }
}

function json(response) {
  return response.json();
}

function error(err) {
  console.log(`Error: ${err}`);
}

function getSchedules() {
  return new Promise((resolve, reject) => {
    const matchesDom = document.getElementById("matches");
    const loading = document.getElementById("loading");

    if ("caches" in window) {
      caches
        .match(`${BASE_URL}competitions/2021/matches?status=SCHEDULED`)
        .then((response) => {
          if (response) {
            response
              .json()
              .then((data) => {
                let matches = "";
                loading.style.display = "none";
                
                if (data !== null || data !== undefined) {

                data.matches.forEach((data) => {
                  matches += viewSchedules(data);
                });

                } else {
                    matches = `
                            <div style="display: flex;
                            flex-direction: column;
                            align-items: center;
                            width: 100%;">
                                <h4>Data Kosong....</h4>
                            </div>
                            `;
                }

                matchesDom.innerHTML = matches;
                resolve(data);
              })
              .catch((err) => {
                error(err);
                reject(err);
              });
          }
        })
        .catch((err) => {
          error(err);
          reject(err);
        });
    }

    if (navigator.onLine) {
      fetchApi(`${BASE_URL}competitions/2021/matches?status=SCHEDULED`)
        .then((res) => res.json())
        .then((data) => {
          let matches = "";
          loading.style.display = "none";
          data.matches.forEach((data) => {
            matches += viewSchedules(data);
          });

          matchesDom.innerHTML = matches;
          resolve(data);
        })
        .catch((err) => {
          error(err);
          reject(err);
        });
    }
  });
}

function getTeams() {
  return new Promise(function (resolve, reject) {
    if ("caches" in window) {
      caches
        .match(`${BASE_URL}competitions/2021/teams`)
        .then((response) => {
          if (response) {
            response
              .json()
              .then((data) => {
                let TeamHTML = "";
                document.getElementById("loading").style.display = "none";

                if (data !== null || data !== undefined) {
                    
                    data.teams.forEach((data, index) => {
                    saveAllTeams(data);
                    checkDataFav(data.id);

                    TeamHTML += viewTeams(data,index);
                    });
                } else {
                    TeamHTML = `
                        <div style="display: flex;
                        flex-direction: column;
                        align-items: center;
                        width: 100%;">
                            <h4>Data Kosong....</h4>
                        </div>
                        `;
                }
                document.getElementById("teams").innerHTML = TeamHTML;
                resolve(data);
              })
              .catch((err) => {
                error(err);
                reject(err);
              });
          }
        })
        .catch((err) => {
          error(err);
          reject(err);
        });
    }

    if (navigator.onLine) {
      try {
        fetchApi(`${BASE_URL}competitions/2021/teams`)
          .then((res) => res.json())
          .then((data) => {
            let teamsHTML = "";
            document.getElementById("loading").style.display = "none";

            data.teams.forEach((data, index) => {
              saveAllTeams(data);

              checkDataFav(data.id);
              teamsHTML += viewTeams(data,index);
            });
            document.getElementById("teams").innerHTML = teamsHTML;
            resolve(data);
          });
      } catch (err) {
        error(err);
        reject(err);
      }
    }
  });
}

async function getTeamsById(id) {
  return new Promise(function (resolve, reject) {
    document.getElementById(`detailTeams-${id}`).innerHTML = setLoadingDetail();

    if ("caches" in window) {
      caches
        .match(`${BASE_URL}teams/${id}`)
        .then((response) => {
          if (response === undefined) {
            getTeamsCachesById(id)
              .then((data) => {
                let detailTeamsHTML = viewDetailTeams(data);
                document.getElementById(
                  `detailTeams-${id}`
                ).innerHTML = detailTeamsHTML;
                resolve(data);
              })
              .catch((err) => {
                error(err);
                reject(err);
              });
          }

          if (response) {
            response
              .json()
              .then((data) => {
                let detailTeamsHTML = viewDetailTeams(data);;
                document.getElementById(
                  `detailTeams-${id}`
                ).innerHTML = detailTeamsHTML;
                resolve(data);
              })
              .catch((err) => {
                error(err);
                reject(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
          error(err);
          reject(err);
        });
    }

    if (navigator.onLine) {
      try {
        fetchApi(`${BASE_URL}teams/${id}`)
          .then((res) => res.json())
          .then((data) => {
            let detailTeamsHTML = viewDetailTeams(data);
            document.getElementById(
              `detailTeams-${id}`
            ).innerHTML = detailTeamsHTML;
            resolve(data);
          });
      } catch (err) {
        error(err);
        reject(err);
      }
    }
  });
}

async function getKelasemen() {
  return new Promise((resolve, reject) => {
    const kelasemenDom = document.getElementById("kelasemenBody");
    const loading = document.getElementById("loading");

    if ("caches" in window) {
      caches
        .match(`${baseURLLigaInggris}standings`)
        .then((response) => {
          if (response) {
            response
              .json()
              .then((data) => {
                let Kelasemen = "";
                loading.style.display = "none";
                if (data !== null || data !== undefined) {

                    data.standings[0].table.forEach((data) => {
                    Kelasemen += viewKlasemen(data);
                    });
                } else {
                    Kelasemen = `
                                <div style="display: flex;
                                flex-direction: column;
                                align-items: center;
                                width: 100%;">
                                    <h4>Data Kosong....</h4>
                                </div>
                                `;
                }

                kelasemenDom.innerHTML = Kelasemen;
                resolve(data);
              })
              .catch((err) => {
                error(err);
                reject(err);
              });
          }
        })
        .catch((err) => {
          error(err);
          reject(err);
        });
    }
    if (navigator.onLine) {
      try {
        fetchApi(`${baseURLLigaInggris}standings`)
          .then((res) => res.json())
          .then((data) => {
            let Kelasemen = "";
            loading.style.display = "none";
            data.standings[0].table.forEach((data) => {
              Kelasemen += viewKlasemen(data);
            });

            kelasemenDom.innerHTML = Kelasemen;
            resolve(data);
          });
      } catch (err) {
        error(err);
        reject(err);
      }
    }
  });
}

function getFavFromIDB() {
  return new Promise((resolve, reject) => {
    getAll()
      .then((data) => {
        document.getElementById("loading").style.display = "none";

        let TeamHTML = "";

        if (data.length > 0) {
          data.forEach((data, index) => {
            TeamHTML += `
                    <ul class="collection">
                        <li class="collection-item avatar"> 
                            <img src="${data.crestUrl}" alt="${data.name}" class="circle" onError="this.onerror=null;this.src='/assets/alt-image.webp';">
                            <span class="title">${data.name}</span>
                            <p class="title" style="padding-top: 5px;font-size: 1.2em;font-weight: 600;">${
                              !!data.venue ? data.venue : "-"
                            }</p>
                            <a href="#modal1${
                              index + 1
                            }" onclick="showDetailTeamFav(${
              data.id
            })" class="modal-trigger secondary-content">Detail</a>
                            <a href="javascript:void(0);" onclick="deleteTeamToDB(${
                              data.id
                            }),M.toast({html: 'Berhasil menghapus dari Favorite'})" class="secondary-content" style="top: 40px;">Delete</a>
                            <div id="modal1${index + 1}" class="modal modal1-${
              data.id
            } modal-fixed-footer">
                                <div class="modal-content grey lighten-2">
                                    <div id="detailTeams-${
                                      data.id
                                    }" style="height:100%"></div>
                                </div>
                                <div class="modal-footer grey lighten-2">
                                    <a class="modal-close waves-effect waves-green btn-flat red-text" onclick="setNullCurrentTeam()">Close</a>
                                </div>
                            </div>
                        </li>
                    </ul>`;
          });
        } else {
          TeamHTML = `
                    <div style="display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 100%;">
                        <h4>Data Kosong....</h4>
                    </div>
                `;
        }
        document.getElementById("fav").innerHTML = TeamHTML;
        resolve(data);
      })
      .catch((err) => {
        error(err);
        reject(err);
      });
  });
}

function getFavByIdFromIDB(id) {
  return new Promise((resolve, reject) => {
    let idParams = parseInt(id),
      TeamHTML;

    getById(idParams)
      .then((data) => {
        if (data !== undefined) {
          TeamHTML = `
                    
                    <div class="row">
                        <div class="col s12 m12">
                            <h6 class="header black-text center-align show-on-medium-and-down"><span style="font-size:2em">${data.name}</span></h6>
                        </div>
                        <div class="col s12 m12">
                            <div class="card grey lighten-2">
                                <div class="card-image">
                                    <img src="${
                                      data.crestUrl
                                    }" style="padding: 4px 0 4px 0;width:50%;margin:auto;" onError="this.onerror=null;this.src='/assets/alt-image.webp';">
                                </div>
                                <div class="card-stacked">
                                    <div class="card-content">
                                        <h5><i class="material-icons">contacts</i> Detail Info</h5>
                                        <div>
                                            <ul>
                                                <li>Alamat: ${data.address}</li>
                                                <li>Phone Number: ${
                                                  data.phone
                                                }</li>
                                                <li>Email: ${data.email}</li>
                                                <li><a href="${
                                                  data.website
                                                }" target="_blank">Website</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
        } else {
          TeamHTML = `
                <div style="display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;">
                    <h4>Data Kosong....</h4>
                </div>
                `;
        }
        document.getElementById(`detailTeams-${idParams}`).innerHTML = TeamHTML;
        resolve(data);
      })
      .catch((err) => {
        error(err);
        reject(err);
      });
  });
}

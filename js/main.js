document.addEventListener("DOMContentLoaded", () => {
    const titlePage = "Premier League";
    const elems = document.querySelectorAll(".sidenav");
  
    let page = window.location.hash.substr(1);
    if ([""].includes(page)) {
      page = "pertandingan";
    }
  
    M.Sidenav.init(elems);
  
    loadNav();
    loadPage(page);
  
    function loadNav() {
      const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
          if (this.status !== 200) {
            return;
          }
          // Load list setiap menu
          document.querySelectorAll(".topnav, .sidenav").forEach((elm) => {
            elm.innerHTML = xhttp.responseText;
          });
  
          // Daftarkan event Listener untuk setiap tautan menu
          document.querySelectorAll(".sidenav a, .topnav a").forEach((elm) => {
            elm.addEventListener("click", (event) => {
              let sidenav = document.querySelector(".sidenav");
              M.Sidenav.getInstance(sidenav).close();
  
              // console.log(event)
              page = event.target.parentNode.getAttribute("href");
              page =
                page !== null
                  ? page.substr(1)
                  : event.target.getAttribute("href").substr(1);
              loadPage(page);
            });
          });
        }
      };
      xhttp.open("GET", "nav.html", true);
      xhttp.send();
    }
  
    function loadPage(page) {
      const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
          const content = document.querySelector("#body-content");
          if (this.status === 200) {
            content.innerHTML = xhttp.responseText;
  
            document.querySelectorAll(".sidenav a, .topnav a").forEach((elm) => {
              if (elm.getAttribute("href").substr(1) === page) {
                elm.classList.add("active");
              } else {
                elm.classList.remove("active");
              }
            });
  
            if (page === "teams") {
              document.title = `${titlePage} - Teams`;
              document.body.style.backgroundColor = 'white'
              getTeams();
            } else if (page === "klasemen") {
              document.title = `${titlePage} - Klasemen`;
              document.body.style.backgroundColor = 'white'
              getKelasemen();
            } else if (page === "favorite"){
              document.title = `${titlePage} - My Favorite Teams`;
              document.body.style.backgroundColor = 'white'
              getFavFromIDB()
            } else {
              document.title = `${titlePage} - Jadwal Pertandingan`;
              document.body.style.backgroundColor = '#3F1052'
              getSchedules()
            }
          } else if (this.status === 404) {
            content.innerHTML = "<p>Page is Not Found</p>";
          } else {
            content.innerHTML = "<p>Ups....Page is Can't access</p>";
          }
        }
      };
      xhttp.open("GET", `pages/${page}.html`, true);
      xhttp.send();
    }
  });
  
'use strict';
{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status < 400) {
        cb(null, xhr.response);
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error('Network request failed'));
    xhr.send();
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach(key => {
      const value = options[key];
      if (key === 'text') {
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        //createAndAppend('pre', root, { text: JSON.stringify(data, null, 2) });
        let arr = JSON.parse(JSON.stringify(data, null, 2));
        arr = arr.sort((a, b) => a.name.localeCompare(b.name));
        repositoryNames(arr);
      }
    });
  }

  const div1 = createAndAppend("div", root, {
    "class": "flex-row heading",
  })
  const hyfHeader = createAndAppend("h1", div1, {
    text: "HYF Repositories",
  })

  function repositoryNames(arr) {
    const repoNames = [];
    const descriptionInfos = [];
    const forkInfos = [];
    const updateInfos = [];
    const contributorsURLInfo = [];
    const repositoryURL = [];
    for (let i = 0; i < arr.length; i++) {
      function dataArrayCreator(arr, elem1, elem2) {
        if (arr[i][elem1]) {
          elem2.push(arr[i][elem1])
        } else {
          elem2.push(0);
        }
      }
      dataArrayCreator(arr, "name", repoNames);
      dataArrayCreator(arr, "description", descriptionInfos);
      dataArrayCreator(arr, "forks_count", forkInfos);
      dataArrayCreator(arr, "updated_at", updateInfos);
      dataArrayCreator(arr, "contributors_url", contributorsURLInfo);
      dataArrayCreator(arr, "html_url", repositoryURL)
    }
    selectNames(repoNames, descriptionInfos, forkInfos, updateInfos, contributorsURLInfo, repositoryURL);
  }


  function selectNames(arr1, arr2, arr3, arr4, arr5, arr6) {
    const selectTag = createAndAppend("select", div1, {
      "class": "select-tag",
    });
    for (let i = 0; i < arr1.length; i++) {
      const repoNameText = arr1[i];
      const descriptionInfoText = arr2[i];
      const forkInfoText = arr3[i];
      const updateInfoText = arr4[i];
      const contributorsURLInfoText = arr5[i];
      const repositoryURLText = arr6[i];
      const dropDownListElem = createAndAppend("option", selectTag, {
        text: arr1[i],
      })
      infoGatherer(dropDownListElem, repoNameText, descriptionInfoText, forkInfoText, updateInfoText, contributorsURLInfoText, repositoryURLText);
    }

    return selectTag;
  }

  function infoGatherer(option, repositoryText, descriptionText, forkText, updateText, contributorsURLText, repositoryURL) {
    option.addEventListener('click', info, false);
    function info() {
      const div = createAndAppend("div", root, {
        "class": "flex-row positioned",
        "id": "container",
      })
      dataDiv(repositoryText, descriptionText, forkText, updateText, div, repositoryURL);
      collaboratorDiv(contributorsURLText, div);
    }
  }

  function dataDiv(aa, bb, cc, dd, ee, ff) {
    const div = createAndAppend("div", ee, {
      "class": "half-width",
    });
    const table = createAndAppend("table", div, {});
    const tr = createAndAppend("tr", table, {});
    const th = createAndAppend("th", tr, {
      "text": "Repository: ",
    })
    const th2 = createAndAppend("th", tr, {});
    th2.innerHTML = `<a target=_blank href= ${ff}>${aa}</a>`
    function tableDataCreator(left, right) {
      const tr = createAndAppend("tr", table, {});
      const tdLeft = createAndAppend("td", tr, {
        "text": left,
      })
      const tdRight = createAndAppend("td", tr, {
        "text": right,
      })
    }
    tableDataCreator("Description: ", bb);
    tableDataCreator("Forks: ", cc);
    tableDataCreator("Updated: ", dd);
  }

  function collaboratorDiv(URL, ee) {
    const div = createAndAppend("div", ee, {
      "class": "half-width",
    });
    const h2 = createAndAppend("h2", div, {
      "text": "Contributions",
    })
    getInfoFromURL(URL, div);
  }


  function getInfoFromURL(url, tag) {
    fetchJSON(url, (err, data) => {
      if (err) {
        createAndAppend("div", root, { text: err.message, class: 'alert-error' });
      } else {
        let arr = JSON.parse(JSON.stringify(data, null, 2));
        contributorsPart(arr);
      }
    })
    function contributorsPart(arr) {
      const ul = createAndAppend("ul", tag, {});
      arr.forEach(elem => {
        const li = createAndAppend("li", ul, {
          "class": "flex-row positioned",
        });
        const div = createAndAppend("div", li, {
          "class": "flex-row login-text",
        });
        const img = createAndAppend("img", div, {
          "src": elem["avatar_url"],
          "class": "avatar",
        })
        const div1 = createAndAppend("div", div, {
          "text": elem["login"],
          "class": "contributor-data",
        })
        const div2 = createAndAppend("div", li, {
          "class": "flex-row contributor-data",
        });
        const div3 = createAndAppend("div", div2, {
          "text": elem["contributions"],
        });
      })
    }
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
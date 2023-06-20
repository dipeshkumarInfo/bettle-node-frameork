"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

const base_path = document.querySelector("meta[name='base_url']").content;


async function submitForm(event,el,reset = 'true',callback) {
  const responseStatus = document.querySelector("#responseStatus");
  event.preventDefault();
  await SubmitData(event,el.action,el)
  .then(function (result) {
      const response = JSON.parse(result);
      responseStatus.innerHTML = response.msg;
      if(response.status == true && reset ==  'true')
      {
        el.reset();
      }
      return result;
  })
  .then((result) => {
    if (callback && typeof callback === "function") { callback(result); } 
  })
  .catch(function (error) {
    responseStatus.innerHTML = JSON.parse(error).msg;
  });
}

const SubmitData =  (thisForm,uploadURL,el) => {

  return new Promise(function (resolve, reject) {

    RequestSend(base_path + "authValidate")
    .then((result) => {
      // console.log("-> "+result);
      var form = document.getElementById(el.id);
      const formData = new FormData(form);

      return RequestSend(uploadURL, formData);
    })
    .then((result) => {
      // console.log("=> "+result);
      resolve(result);
    })
    .catch(function (error) {
      // console.log("=-> "+error);
      reject(error);
    });
});
}

const RequestPost = async (url, data, callback) => {
  await ChangableData(url,data)
  .then(function (result) {
      const response = JSON.parse(result);
      responseStatus.innerHTML = response.msg;
      return result;
  })
  .then((result) => {
    if (callback && typeof callback === "function") { callback(result); } 
  })
  .catch(function (error) {
    responseStatus.innerHTML = JSON.parse(error).msg;
  });
}

const ChangableData =  (uploadURL,formData) => {

  return new Promise(function (resolve, reject) {

    RequestSend(base_path + "authValidate")
    .then((result) => {
      // console.log("-> "+result);
      return RequestSend(uploadURL, formData);
    })
    .then((result) => {
      // console.log("=> "+result);
      resolve(result);
    })
    .catch(function (error) {
      // console.log("=-> "+error);
      reject(error);
    });
});
}

const RequestSend = (uploadURL, formData = null) => {
  return new Promise(function (resolve, reject) {

    const bgProgress = document.querySelector(".bg-progress");
    const progressPercent = document.querySelector("#progressPercent");
    const progressContainer = document.querySelector(".progress-container");
    const progressBar = document.querySelector(".progress-bar");
  
    progressContainer.style.display = "block";
  
    var xhttp = new XMLHttpRequest();
    
    xhttp.onprogress = function (event) {
      let percent = Math.round((100 * event.loaded) / event.total);
      progressPercent.innerText = percent;
      const scaleX = `scaleX(${percent / 100})`;
      bgProgress.style.transform = scaleX;
      progressBar.style.transform = scaleX;
    };

    xhttp.open("POST", uploadURL, true);
    xhttp.setRequestHeader("X-CSRF-Token",document.querySelector("meta[name='csrf-token']").content);
    xhttp.setRequestHeader("Accept","application/json");
    // xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(formData);

    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == XMLHttpRequest.DONE) {
        // console.log(xhttp.responseText);
        // const result = JSON.parse(xhttp.response);
        // if (result && result.auth)
        // {
          if(xhttp.status === 200)
          {
            resolve(xhttp.response);
          }else{
            reject(xhttp.response);
          }
        // }else{
        //   console.log("redirect");
        //   // reject(window.location.href = base_path+ "login");
        // }
      }
    };

    xhttp.onerror = function () {
      // reject(xhr.status);
      // reject(xhttp.statusText);
      reject(xhttp.statusText);
    };
  
  });
}

function selectShowInput(select,value,hiddenInputId)
{
  if(select.value==value){
    document.getElementById(hiddenInputId).style.display = "block";
    } else{
    document.getElementById(hiddenInputId).style.display = "none";
    }
}

document.addEventListener('DOMContentLoaded', function () {
  'use strict';


  feather.replace();

  (function(){
    var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if(width <= 768)
    {
      document.querySelector('.sidebar').classList.remove('hidden');
    }
  })();

  (function () {
    var sidebar = document.querySelector('.sidebar'),
        catSubMenu = document.querySelector('.cat-sub-menu'),
        sidebarBtns = document.querySelectorAll('.sidebar-toggle');

    var _iterator = _createForOfIteratorHelper(sidebarBtns),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var sidebarBtn = _step.value;

        if (sidebarBtn && catSubMenu && sidebarBtn) {
          sidebarBtn.addEventListener('click', function () {
            var _iterator2 = _createForOfIteratorHelper(sidebarBtns),
                _step2;

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var sdbrBtn = _step2.value;
                sdbrBtn.classList.toggle('rotated');
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }

            sidebar.classList.toggle('hidden');
            if(sidebar.classList.contains('hidden'))
            {
              console.log('close');
              setPaddingLeftSubMenu('sub-menu','0px');
            }else{
              console.log('open');
              setPaddingLeftSubMenu('sub-menu','10px');
            }
            catSubMenu.classList.remove('visible');
          });
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  })();

  function setPaddingLeftSubMenu(className,value){
      var elements = document.getElementsByClassName(className);
      for (var i = 0, len = elements.length; i < len; i++) {
          elements[i].style.paddingLeft = value;
      };
  }

  (function () {
    var showCatBtns = document.querySelectorAll('.show-cat-btn');

    if (showCatBtns) {
      showCatBtns.forEach(function (showCatBtn) {
        var catSubMenu = showCatBtn.nextElementSibling;
        showCatBtn.addEventListener('click', function (e) {
          e.preventDefault();
          catSubMenu.classList.toggle('visible');
          var catBtnToRotate = document.querySelector('.category__btn');
          catBtnToRotate.classList.toggle('rotated');
        });
      });
    }
  })();

  (function () {
    var showMenu = document.querySelector('.lang-switcher');
    var langMenu = document.querySelector('.lang-menu');
    var layer = document.querySelector('.layer');

    if (showMenu) {
      showMenu.addEventListener('click', function () {
        langMenu.classList.add('active');
        layer.classList.add('active');
      });

      if (layer) {
        layer.addEventListener('click', function (e) {
          if (langMenu.classList.contains('active')) {
            langMenu.classList.remove('active');
            layer.classList.remove('active');
          }
        });
      }
    }
  })();

  (function () {
    var userDdBtnList = document.querySelectorAll('.dropdown-btn');
    var userDdList = document.querySelectorAll('.users-item-dropdown');
    var layer = document.querySelector('.layer');

    if (userDdList && userDdBtnList) {
      var _iterator3 = _createForOfIteratorHelper(userDdBtnList),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var userDdBtn = _step3.value;
          userDdBtn.addEventListener('click', function (e) {
            layer.classList.add('active');

            var _iterator4 = _createForOfIteratorHelper(userDdList),
                _step4;

            try {
              for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                var userDd = _step4.value;

                if (e.currentTarget.nextElementSibling == userDd) {
                  if (userDd.classList.contains('active')) {
                    userDd.classList.remove('active');
                  } else {
                    userDd.classList.add('active');
                  }
                } else {
                  userDd.classList.remove('active');
                }
              }
            } catch (err) {
              _iterator4.e(err);
            } finally {
              _iterator4.f();
            }
          });
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }

    if (layer) {
      layer.addEventListener('click', function (e) {
        var _iterator5 = _createForOfIteratorHelper(userDdList),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var userDd = _step5.value;

            if (userDd.classList.contains('active')) {
              userDd.classList.remove('active');
              layer.classList.remove('active');
            }
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
      });
    }
  })();

  (function () {
    var darkMode = localStorage.getItem('darkMode');
    var darkModeToggle = document.querySelector('.theme-switcher');

    var enableDarkMode = function enableDarkMode() {
      document.body.classList.add('darkmode');
      localStorage.setItem('darkMode', 'enabled');
    };

    var disableDarkMode = function disableDarkMode() {
      document.body.classList.remove('darkmode');
      localStorage.setItem('darkMode', null);
    };

    if (darkMode === 'enabled') {
      enableDarkMode();
    }

    if (darkModeToggle) {
      darkModeToggle.addEventListener('click', function () {
        darkMode = localStorage.getItem('darkMode');

        if (darkMode !== 'enabled') {
          enableDarkMode();
        } else {
          disableDarkMode();
        }

        addData();
      });
    }
  })();

  (function () {
    var checkAll = document.querySelector('.check-all');
    var checkers = document.querySelectorAll('.check');

    if (checkAll && checkers) {
      checkAll.addEventListener('change', function (e) {
        var _iterator6 = _createForOfIteratorHelper(checkers),
            _step6;

        try {
          for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
            var checker = _step6.value;

            if (checkAll.checked) {
              checker.checked = true;
              checker.parentElement.parentElement.parentElement.classList.add('active');
            } else {
              checker.checked = false;
              checker.parentElement.parentElement.parentElement.classList.remove('active');
            }
          }
        } catch (err) {
          _iterator6.e(err);
        } finally {
          _iterator6.f();
        }
      });

      var _iterator7 = _createForOfIteratorHelper(checkers),
          _step7;

      try {
        var _loop = function _loop() {
          var checker = _step7.value;
          checker.addEventListener('change', function (e) {
            checker.parentElement.parentElement.parentElement.classList.toggle('active');

            if (!checker.checked) {
              checkAll.checked = false;
            }

            var totalCheckbox = document.querySelectorAll('.users-table .check');
            var totalChecked = document.querySelectorAll('.users-table .check:checked');

            if (totalCheckbox && totalChecked) {
              if (totalCheckbox.length == totalChecked.length) {
                checkAll.checked = true;
              } else {
                checkAll.checked = false;
              }
            }
          });
        };

        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
    }
  })();

  (function () {
    var checkAll = document.querySelector('.check-all');
    var checkers = document.querySelectorAll('.check');
    var checkedSum = document.querySelector('.checked-sum');

    if (checkedSum && checkAll && checkers) {
      checkAll.addEventListener('change', function (e) {
        var totalChecked = document.querySelectorAll('.users-table .check:checked');
        checkedSum.textContent = totalChecked.length;
      });

      var _iterator8 = _createForOfIteratorHelper(checkers),
          _step8;

      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var checker = _step8.value;
          checker.addEventListener('change', function (e) {
            var totalChecked = document.querySelectorAll('.users-table .check:checked');
            checkedSum.textContent = totalChecked.length;
          });
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }
    }
  })();

  var gridLine;
  var titleColor;

  function addData() {
    var darkMode = localStorage.getItem('darkMode');

    if (darkMode === 'enabled') {
      gridLine = '#37374F';
      titleColor = '#EFF0F6';
    } else {
      gridLine = '#EEEEEE';
      titleColor = '#171717';
    }
  }

  addData();


  (function(){
    // Get all the navigation links
    const links = document.querySelectorAll('.link-page');
    // Get the current page's URL
    const currentPage = window.location.pathname;
    // Iterate over the links and add the active class to the current page's link
    links.forEach(link => {
      if (link.getAttribute('currentActivePage') === currentPage) {
        link.classList.add('active');
      }
    });
  })();


});
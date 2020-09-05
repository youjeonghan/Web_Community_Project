<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>MAIN</title>
  </head>
  <body>
    <nav>
      <ul>
        <li><a href="#">main</a></li>
        <li><a href="#sub1">sub1</a></li>
        <li><a href="#sub2">sub2</a></li>
      </ul>
    </nav>
    <section>
      <h1>MAIN</h1>
      This is main page.
    </section>
    <script>
    (function(){
      var sectionEl = document.querySelector('section');
      var mainHtml = sectionEl.innerHTML;
      var routerMap = {
        '' : function() {
          sectionEl.innerHTML = mainHtml;
        },
        'sub1' : function() {
          drawSection('sub1.json')
        },
        'sub2' : function() {
          drawSection('sub2.json')
        }
      }

      function otherwise() {
        sectionEl.innerHTML =
          'Not Found';
      }

      function router() {
        var hashValue = location.hash.replace('#', '');
        (routerMap[hashValue] || otherwise)();
      }


      function drawSection(url) {
        //02와 동일하므로 생략
      }

      function ajaxGet(url, callback) {
        //02와 동일하므로 생략
      }

      window.addEventListener('DOMContentLoaded', router);
      window.addEventListener('hashchange', router);
    })();
    </script>
  </body>
</html>


출처: https://www.reimaginer.me/entry/spa-and-spa-routing [Reimaginer]
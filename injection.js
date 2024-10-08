    //boot js
    let OnQuestion = (location.pathname == "/books/study/word-test-confirm/quiz");
    let OldLoc;
    if (!OnQuestion) {
        OldLoc = location.pathname;
    }
    
    function makeDraggable(element) {
        let offsetX = 0, offsetY = 0, mouseX = 0, mouseY = 0;
    
        element.onmousedown = function(e) {
            e.preventDefault();
            mouseX = e.clientX;
            mouseY = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        };
    
        function elementDrag(e) {
            e.preventDefault();
            offsetX = mouseX - e.clientX;
            offsetY = mouseY - e.clientY;
            mouseX = e.clientX;
            mouseY = e.clientY;
            element.style.top = (element.offsetTop - offsetY) + "px";
            element.style.left = (element.offsetLeft - offsetX) + "px";
        }
    
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    
    function StartLoad() {
      document.getElementById("loadingPop").style.display = "block";
    }
    
    function ExitLoad() {
      document.getElementById("loadingPop").style.display = "none";
    }
    
    //abceed script
    let AnswerData;

    let UserData = {
        AuthToken : "",
    }

    let AutoClearData = {
        ClassID : "",
        TaskID : "",
    }
    
    let AnswerAssist = false;
    
    const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));
    
    async function ShowCustomPop(ms) {
        document.getElementById("customPop").style.display = "block";
        document.getElementById("customPop").textContent = ms;
        await sleep(500);
        document.getElementById("customPop").style.display = "none";
    }
    
    function AssistFunc() {
        for (let i = 0; i < document.getElementById("answerPop").children.length; i++) {
            document.getElementById("answerPop").children[i].style.backgroundColor = "white";
        }
        document.getElementById("answerPop").children[Number(document.getElementsByClassName("marksheet-answer__number")[0].textContent.replaceAll(" ","").replaceAll("\n","").split("/")[0])+3].style.backgroundColor = "yellow";
        console.log("changed");
    }
    
    const callback = (mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('loading') && AnswerAssist) {
                        AssistFunc();
                    }
                });
            }
        }
    };
    
    const config = { childList: true, subtree: true };
    const observer = new MutationObserver(callback);
    
    function CloseElem() {
        document.getElementById("answerPop").style.display = "none";
    }

function GetUserData() {
    UserData.AuthToken = localStorage.getItem("abcJwtToken");

    ShowCustomPop("Success");
}

function ToggleAssist() {
    if (location.pathname != "/books/study/word-test-confirm/quiz") {
        alert("タスクを開始してから押してください");
        return
    }
    if (AnswerAssist) {
        document.getElementById("tglAst").style.setProperty("background-color","white","important");
        document.getElementById("tglAst").style.setProperty("color","black","important");
        AnswerAssist = !AnswerAssist;
        ShowCustomPop("Assist OFF");
        observer.disconnect();
    } else {
        document.getElementById("tglAst").style.setProperty("background-color","royalblue","important");
        document.getElementById("tglAst").style.setProperty("color","white","important");
        AnswerAssist = !AnswerAssist;
        ShowCustomPop("Assist ON");
        AssistFunc();
        
        observer.observe(document.body, config);
    }
}
function ShowAnswer() {
    const url = 'https://app-api.abceed.com/web/world_practices/info?id_task='+location.pathname.split("/")[3];

StartLoad();
fetch(url, {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + UserData.AuthToken,
        'sec-ch-ua': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Chrome OS"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
        'X-User-Agent': 'abceed-web:7.1.0/Chrome:127.0.6533.132',
        'Content-Type': 'application/json'
    },
})
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(data => {
    console.log('Success:', data.all_question_list);
    AnswerData = data.all_question_list;

    ansPop = document.getElementById("answerPop");
    makeDraggable(ansPop);
    ansPop.innerHTML = '<a id="closeBtn" onclick="javascript:CloseElem()">×</a>';
    te = document.createElement("h1");
    te.textContent = "Answer List";
    ansPop.appendChild(te);
    AnswerListElem = document.createElement("a");
    AnswerListElem.innerHTML = `英語 日本語<hr style="border: none !important;border-top: 1px solid black !important;margin: 0 !important;"><br>`;
    ansPop.appendChild(AnswerListElem);
    data.all_question_list.forEach(ans => {
        AnswerListElem = document.createElement("a");
        AnswerListElem.innerHTML = `${ans.word} ${ans.word_ja}<hr style="border: none !important;border-top: 1px solid black !important;margin: 0 !important;"><br>`;
        ansPop.appendChild(AnswerListElem);
    });
    ansPop.style.display = "block";
})
.catch(error => {
    console.error('Error:', error);
}).finally(() => {
    ExitLoad();
});
}

(function(){
    if (location.host != "app.abceed.com" || document.getElementById("showHubbox") != null) {
        return
    }

    hubButton = document.createElement("div");
hub = document.body.insertBefore(hubButton, document.body.firstChild);
hub.innerHTML += atob("PHN0eWxlPgogIC5kcmFnZ2FibGUgewogICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTsKICAgICAgcG9zaXRpb246IGFic29sdXRlOwogICAgICB0b3A6IDUwcHg7CiAgICAgIGxlZnQ6IDUwcHg7CiAgICAgIGN1cnNvcjogbW92ZTsKICAgICAgZGlzcGxheTogZmxleDsKICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7CiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAgICAgIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrOwogICAgICBwYWRkaW5nLWxlZnQ6IDIwcHg7CiAgICAgIHotaW5kZXg6IDEwMDA7CiAgICAgIHVzZXItc2VsZWN0OiBub25lOwogIH0KCiAgLnN3aXRjaGJ0biB7CiAgICBib3JkZXI6IDJweCBzb2xpZCByZ2IoMTYsIDEwOSwgMTQwKTsKICAgICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7CiAgICAgIGNvbG9yOiBibGFjazsKICAgICAgY3Vyc29yOiBwb2ludGVyOwogIH0KCiAgI2h1YmJveCB7CiAgICAgIGJhY2tncm91bmQtY29sb3I6IHdoaXRlOwogICAgICBwb3NpdGlvbjogYWJzb2x1dGU7CiAgICAgIGRpc3BsYXk6IG5vbmU7CiAgICAgIGN1cnNvcjogbW92ZTsKICAgICAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7CiAgICAgIHBhZGRpbmc6IDIwcHggMjBweCAyMHB4IDIwcHg7CiAgICAgIHotaW5kZXg6ICAgOTk5OwogIH0KCiAgLnBvcCB7CiAgICBkaXNwbGF5OiBmbGV4OwogICAgcG9zaXRpb246IHJlbGF0aXZlOwogIH0KCiNsb2FkaW5nUG9wIHsKICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7CiAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsKICAgZGlzcGxheTogbm9uZTsKICAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7CiAgIHBhZGRpbmc6IDIwcHggMjBweCAyMHB4IDIwcHg7Cn0KCiNhbnN3ZXJQb3AgewogICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTsKICAgICAgcG9zaXRpb246IGFic29sdXRlOwogICAgICBkaXNwbGF5OiBub25lOwogICAgICBjdXJzb3I6IG1vdmU7CiAgICAgIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrOwogICAgICBwYWRkaW5nOiAyMHB4IDIwcHggMjBweCAyMHB4OwogICAgICB6LWluZGV4OiAgIDk5OTsKfQoKI2Nsb3NlQnRuIHsKICBwb3NpdGlvbjogYWJzb2x1dGU7CiAgdG9wOiAxMHB4OwogIHJpZ2h0OiAxMHB4OwogIGN1cnNvcjogcG9pbnRlcjsKfQoKI2N1c3RvbVBvcCB7CiAgIGJhY2tncm91bmQtY29sb3I6IHdoaXRlOwogICBwb3NpdGlvbjogYWJzb2x1dGU7CiAgIGRpc3BsYXk6IG5vbmU7CiAgIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrOwogICBwYWRkaW5nOiAyMHB4IDIwcHggMjBweCAyMHB4Owp9CgogIC5kcmFnIHsKICAgICAgei1pbmRleDogMTAwMTsKICB9Cjwvc3R5bGU+Cgo8ZGl2IGlkPSJkcmFnZ2FibGVFbGVtZW50IiBjbGFzcz0iZHJhZ2dhYmxlIj4KICA8YnV0dG9uIGlkPSJzaG93SHViYm94IiBjbGFzcz0ic3dpdGNoYnRuIj5BYmNlZWQgVXRpbGl0eTwvYnV0dG9uPgo8L2Rpdj4KCjxkaXYgaWQ9Imh1YmJveCI+CiAgPGgxPjxiPkFiY2VlZCBVdGlsaXR5IEh1YjwvYj48L2gxPgogIDxhIG9uY2xpY2s9ImphdmFzY3JpcHQ6R2V0VXNlckRhdGEoKSI+SW5pdGFsaXplPC9hPjxicj4KPGEgb25jbGljaz0iamF2YXNjcmlwdDpTaG93QW5zd2VyKCkiPlZpZXcgQW5zd2VyPC9hPjxicj4KPGEgaWQ9InRnbEFzdCIgb25jbGljaz0iamF2YXNjcmlwdDpUb2dnbGVBc3Npc3QoKSI+QW5zd2VyIEFzc2lzdDwvYT48YnI+CjxhIG9uY2xpY2s9ImphdmFzY3JpcHQ6YWxlcnQoJ2Z1bmN0aW9uIGlzIG5vdCBmb3VuZCcpIj5BdXRvIENvbXBsZXRlPC9hPjxicj4KPGRpdiBjbGFzcz0icG9wIj4KICA8aDEgaWQ9ImxvYWRpbmdQb3AiPkxvYWRpbmcuLi48L2gxPgogIDxoMSBpZD0iY3VzdG9tUG9wIj48L2gxPgo8L2Rpdj4KPC9kaXY+CjxkaXYgaWQ9ImFuc3dlclBvcCI+CiAgPGEgaWQ9ImNsb3NlQnRuIiBvbmNsaWNrPSJqYXZhc2NyaXB0OkNsb3NlRWxlbSgpIj7DlzwvYT4KPC9kaXY+Cgo8c2NyaXB0PgogIC8vYm9vdCBqcwogIGxldCBPblF1ZXN0aW9uID0gKGxvY2F0aW9uLnBhdGhuYW1lID09ICIvYm9va3Mvc3R1ZHkvd29yZC10ZXN0LWNvbmZpcm0vcXVpeiIpOwogICAgbGV0IE9sZExvYzsKICAgIGlmICghT25RdWVzdGlvbikgewogICAgICAgIE9sZExvYyA9IGxvY2F0aW9uLnBhdGhuYW1lOwogICAgfQogICAgCiAgICBmdW5jdGlvbiBtYWtlRHJhZ2dhYmxlKGVsZW1lbnQpIHsKICAgICAgICBsZXQgb2Zmc2V0WCA9IDAsIG9mZnNldFkgPSAwLCBtb3VzZVggPSAwLCBtb3VzZVkgPSAwOwogICAgCiAgICAgICAgZWxlbWVudC5vbm1vdXNlZG93biA9IGZ1bmN0aW9uKGUpIHsKICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpOwogICAgICAgICAgICBtb3VzZVggPSBlLmNsaWVudFg7CiAgICAgICAgICAgIG1vdXNlWSA9IGUuY2xpZW50WTsKICAgICAgICAgICAgZG9jdW1lbnQub25tb3VzZXVwID0gY2xvc2VEcmFnRWxlbWVudDsKICAgICAgICAgICAgZG9jdW1lbnQub25tb3VzZW1vdmUgPSBlbGVtZW50RHJhZzsKICAgICAgICB9OwogICAgCiAgICAgICAgZnVuY3Rpb24gZWxlbWVudERyYWcoZSkgewogICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7CiAgICAgICAgICAgIG9mZnNldFggPSBtb3VzZVggLSBlLmNsaWVudFg7CiAgICAgICAgICAgIG9mZnNldFkgPSBtb3VzZVkgLSBlLmNsaWVudFk7CiAgICAgICAgICAgIG1vdXNlWCA9IGUuY2xpZW50WDsKICAgICAgICAgICAgbW91c2VZID0gZS5jbGllbnRZOwogICAgICAgICAgICBlbGVtZW50LnN0eWxlLnRvcCA9IChlbGVtZW50Lm9mZnNldFRvcCAtIG9mZnNldFkpICsgInB4IjsKICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5sZWZ0ID0gKGVsZW1lbnQub2Zmc2V0TGVmdCAtIG9mZnNldFgpICsgInB4IjsKICAgICAgICB9CiAgICAKICAgICAgICBmdW5jdGlvbiBjbG9zZURyYWdFbGVtZW50KCkgewogICAgICAgICAgICBkb2N1bWVudC5vbm1vdXNldXAgPSBudWxsOwogICAgICAgICAgICBkb2N1bWVudC5vbm1vdXNlbW92ZSA9IG51bGw7CiAgICAgICAgfQogICAgfQogICAgCiAgICBmdW5jdGlvbiBTdGFydExvYWQoKSB7CiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJsb2FkaW5nUG9wIikuc3R5bGUuZGlzcGxheSA9ICJibG9jayI7CiAgICB9CiAgICAKICAgIGZ1bmN0aW9uIEV4aXRMb2FkKCkgewogICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgibG9hZGluZ1BvcCIpLnN0eWxlLmRpc3BsYXkgPSAibm9uZSI7CiAgICB9CiAgICAKICAgIGNvbnN0IGRyYWdnYWJsZUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiZHJhZ2dhYmxlRWxlbWVudCIpOwogICAgICAgY29uc3QgaHViYm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoImh1YmJveCIpOwogICAgICAgbWFrZURyYWdnYWJsZShkcmFnZ2FibGVFbGVtZW50KTsKICAgIAogICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoInNob3dIdWJib3giKS5hZGRFdmVudExpc3RlbmVyKCJjbGljayIsIGZ1bmN0aW9uKCkgewogICAgICAgICAgIG1ha2VEcmFnZ2FibGUoaHViYm94KTsKICAgICAgICAgICBodWJib3guc3R5bGUuZGlzcGxheSA9IGh1YmJveC5zdHlsZS5kaXNwbGF5ID09PSAibm9uZSIgPyAiYmxvY2siIDogIm5vbmUiOwogICAgICAgfSk7CiAgICAKICAgIC8vYWJjZWVkIHNjcmlwdAogICAgbGV0IEFuc3dlckRhdGE7CgogICAgbGV0IFVzZXJEYXRhID0gewogICAgICAgIERvY3VtZW50SUQgOiAiIiwKICAgICAgICBBdXRoVG9rZW4gOiAiIiwKICAgIH0KCiAgICBsZXQgQXV0b0NsZWFyRGF0YSA9IHsKICAgICAgICBDbGFzc0lEIDogIiIsCiAgICAgICAgVGFza0lEIDogIiIsCiAgICB9CiAgICAKICAgIGxldCBBbnN3ZXJBc3Npc3QgPSBmYWxzZTsKICAgIAogICAgY29uc3Qgc2xlZXAgPSAodGltZSkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGltZSkpOwoKICAgIGZ1bmN0aW9uIEdldFVzZXJEYXRhKCkgewogICAgICAgIGRpZCA9IHdpbmRvdy5wcm9tcHQoIkVudGVyIERvY3VtZW50SUQiLCIiKTsKICAgICAgICBpZiAoZGlkID09IG51bGwgfHwgZGlkID09ICIiKSB7CiAgICAgICAgICAgIGFsZXJ0KCJFcnJvciIpOwogICAgICAgICAgICByZXR1cm4KICAgICAgICB9CiAgICAgICAgVXNlckRhdGEuRG9jdW1lbnRJRCA9IGRpZDsKICAgICAgICAKICAgICAgICBVc2VyRGF0YS5BdXRoVG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgiYWJjSnd0VG9rZW4iKTsKICAgIH0KCiAgICAvL0dldFVzZXJEYXRhKCk7CiAgICAKICAgIGFzeW5jIGZ1bmN0aW9uIFNob3dDdXN0b21Qb3AobXMpIHsKICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiY3VzdG9tUG9wIikuc3R5bGUuZGlzcGxheSA9ICJibG9jayI7CiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoImN1c3RvbVBvcCIpLnRleHRDb250ZW50ID0gbXM7CiAgICAgICAgYXdhaXQgc2xlZXAoNTAwKTsKICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiY3VzdG9tUG9wIikuc3R5bGUuZGlzcGxheSA9ICJub25lIjsKICAgIH0KICAgIAogICAgZnVuY3Rpb24gVG9nZ2xlQXNzaXN0KCkgewogICAgICAgIGlmIChsb2NhdGlvbi5wYXRobmFtZSAhPSAiL2Jvb2tzL3N0dWR5L3dvcmQtdGVzdC1jb25maXJtL3F1aXoiKSB7CiAgICAgICAgICAgIGFsZXJ0KCLjgr/jgrnjgq/jgpLplovlp4vjgZfjgabjgYvjgonmirzjgZfjgabjgY/jgaDjgZXjgYQiKTsKICAgICAgICAgICAgcmV0dXJuCiAgICAgICAgfQogICAgICAgIGlmIChBbnN3ZXJBc3Npc3QpIHsKICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoInRnbEFzdCIpLnN0eWxlLnNldFByb3BlcnR5KCJiYWNrZ3JvdW5kLWNvbG9yIiwid2hpdGUiLCJpbXBvcnRhbnQiKTsKICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoInRnbEFzdCIpLnN0eWxlLnNldFByb3BlcnR5KCJjb2xvciIsImJsYWNrIiwiaW1wb3J0YW50Iik7CiAgICAgICAgICAgIEFuc3dlckFzc2lzdCA9ICFBbnN3ZXJBc3Npc3Q7CiAgICAgICAgICAgIFNob3dDdXN0b21Qb3AoIkFzc2lzdCBPRkYiKTsKICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpOwogICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJ0Z2xBc3QiKS5zdHlsZS5zZXRQcm9wZXJ0eSgiYmFja2dyb3VuZC1jb2xvciIsInJveWFsYmx1ZSIsImltcG9ydGFudCIpOwogICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgidGdsQXN0Iikuc3R5bGUuc2V0UHJvcGVydHkoImNvbG9yIiwid2hpdGUiLCJpbXBvcnRhbnQiKTsKICAgICAgICAgICAgQW5zd2VyQXNzaXN0ID0gIUFuc3dlckFzc2lzdDsKICAgICAgICAgICAgU2hvd0N1c3RvbVBvcCgiQXNzaXN0IE9OIik7CiAgICAgICAgICAgIEFzc2lzdEZ1bmMoKTsKICAgICAgICAgICAgCiAgICAgICAgICAgIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSwgY29uZmlnKTsKICAgICAgICB9CiAgICB9CiAgICAKICAgIGZ1bmN0aW9uIEFzc2lzdEZ1bmMoKSB7CiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiYW5zd2VyUG9wIikuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHsKICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoImFuc3dlclBvcCIpLmNoaWxkcmVuW2ldLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICJ3aGl0ZSI7CiAgICAgICAgfQogICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJhbnN3ZXJQb3AiKS5jaGlsZHJlbltOdW1iZXIoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgibWFya3NoZWV0LWFuc3dlcl9fbnVtYmVyIilbMF0udGV4dENvbnRlbnQucmVwbGFjZUFsbCgiICIsIiIpLnJlcGxhY2VBbGwoIlxuIiwiIikuc3BsaXQoIi8iKVswXSkrM10uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gInllbGxvdyI7CiAgICAgICAgY29uc29sZS5sb2coImNoYW5nZWQiKTsKICAgIH0KICAgIAogICAgY29uc3QgY2FsbGJhY2sgPSAobXV0YXRpb25zTGlzdCkgPT4gewogICAgICAgIGZvciAoY29uc3QgbXV0YXRpb24gb2YgbXV0YXRpb25zTGlzdCkgewogICAgICAgICAgICBpZiAobXV0YXRpb24udHlwZSA9PT0gJ2NoaWxkTGlzdCcpIHsKICAgICAgICAgICAgICAgIG11dGF0aW9uLmFkZGVkTm9kZXMuZm9yRWFjaChub2RlID0+IHsKICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgJiYgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2xvYWRpbmcnKSAmJiBBbnN3ZXJBc3Npc3QpIHsKICAgICAgICAgICAgICAgICAgICAgICAgQXNzaXN0RnVuYygpOwogICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgIH0pOwogICAgICAgICAgICB9CiAgICAgICAgfQogICAgfTsKICAgIAogICAgY29uc3QgY29uZmlnID0geyBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUgfTsKICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoY2FsbGJhY2spOwogICAgCiAgICBmdW5jdGlvbiBTaG93QW5zd2VyKCkgewogICAgICAgIGNvbnN0IHVybCA9ICdodHRwczovL2FwcC1hcGkuYWJjZWVkLmNvbS93ZWIvd29ybGRfcHJhY3RpY2VzL2luZm8/aWRfdGFzaz0nK2xvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KCIvIilbM107CiAgICAKICAgIFN0YXJ0TG9hZCgpOwogICAgZmV0Y2godXJsLCB7CiAgICAgICAgbWV0aG9kOiAnR0VUJywKICAgICAgICBoZWFkZXJzOiB7CiAgICAgICAgICAgICdkb2N1bWVudElkJzogVXNlckRhdGEuRG9jdW1lbnRJRCwKICAgICAgICAgICAgJ0F1dGhvcml6YXRpb24nOiAnQmVhcmVyICcgKyBVc2VyRGF0YS5BdXRoVG9rZW4sCiAgICAgICAgICAgICdzZWMtY2gtdWEnOiAnIk5vdClBO0JyYW5kIjt2PSI5OSIsICJHb29nbGUgQ2hyb21lIjt2PSIxMjciLCAiQ2hyb21pdW0iO3Y9IjEyNyInLAogICAgICAgICAgICAnc2VjLWNoLXVhLW1vYmlsZSc6ICc/MCcsCiAgICAgICAgICAgICdzZWMtY2gtdWEtcGxhdGZvcm0nOiAnIkNocm9tZSBPUyInLAogICAgICAgICAgICAnU2VjLUZldGNoLURlc3QnOiAnZW1wdHknLAogICAgICAgICAgICAnU2VjLUZldGNoLU1vZGUnOiAnY29ycycsCiAgICAgICAgICAgICdTZWMtRmV0Y2gtU2l0ZSc6ICdzYW1lLXNpdGUnLAogICAgICAgICAgICAnVXNlci1BZ2VudCc6ICdNb3ppbGxhLzUuMCAoWDExOyBDck9TIHg4Nl82NCAxNDU0MS4wLjApIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMjcuMC4wLjAgU2FmYXJpLzUzNy4zNicsCiAgICAgICAgICAgICdYLVVzZXItQWdlbnQnOiAnYWJjZWVkLXdlYjo3LjEuMC9DaHJvbWU6MTI3LjAuNjUzMy4xMzInLAogICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nCiAgICAgICAgfSwKICAgIH0pCiAgICAudGhlbihyZXNwb25zZSA9PiB7CiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykgewogICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05ldHdvcmsgcmVzcG9uc2Ugd2FzIG5vdCBvaycpOwogICAgICAgIH0KICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpOwogICAgfSkKICAgIC50aGVuKGRhdGEgPT4gewogICAgICAgIGNvbnNvbGUubG9nKCdTdWNjZXNzOicsIGRhdGEuYWxsX3F1ZXN0aW9uX2xpc3QpOwogICAgICAgIEFuc3dlckRhdGEgPSBkYXRhLmFsbF9xdWVzdGlvbl9saXN0OwogICAgCiAgICAgICAgYW5zUG9wID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoImFuc3dlclBvcCIpOwogICAgICAgIG1ha2VEcmFnZ2FibGUoYW5zUG9wKTsKICAgICAgICBhbnNQb3AuaW5uZXJIVE1MID0gJzxhIGlkPSJjbG9zZUJ0biIgb25jbGljaz0iamF2YXNjcmlwdDpDbG9zZUVsZW0oKSI+w5c8L2E+JzsKICAgICAgICB0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoImgxIik7CiAgICAgICAgdGUudGV4dENvbnRlbnQgPSAiQW5zd2VyIExpc3QiOwogICAgICAgIGFuc1BvcC5hcHBlbmRDaGlsZCh0ZSk7CiAgICAgICAgQW5zd2VyTGlzdEVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCJhIik7CiAgICAgICAgQW5zd2VyTGlzdEVsZW0uaW5uZXJIVE1MID0gYOiLseiqniDml6XmnKzoqp48aHIgc3R5bGU9ImJvcmRlcjogbm9uZSAhaW1wb3J0YW50O2JvcmRlci10b3A6IDFweCBzb2xpZCBibGFjayAhaW1wb3J0YW50O21hcmdpbjogMCAhaW1wb3J0YW50OyI+PGJyPmA7CiAgICAgICAgYW5zUG9wLmFwcGVuZENoaWxkKEFuc3dlckxpc3RFbGVtKTsKICAgICAgICBkYXRhLmFsbF9xdWVzdGlvbl9saXN0LmZvckVhY2goYW5zID0+IHsKICAgICAgICAgICAgQW5zd2VyTGlzdEVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCJhIik7CiAgICAgICAgICAgIEFuc3dlckxpc3RFbGVtLmlubmVySFRNTCA9IGAke2Fucy53b3JkfSAke2Fucy53b3JkX2phfTxociBzdHlsZT0iYm9yZGVyOiBub25lICFpbXBvcnRhbnQ7Ym9yZGVyLXRvcDogMXB4IHNvbGlkIGJsYWNrICFpbXBvcnRhbnQ7bWFyZ2luOiAwICFpbXBvcnRhbnQ7Ij48YnI+YDsKICAgICAgICAgICAgYW5zUG9wLmFwcGVuZENoaWxkKEFuc3dlckxpc3RFbGVtKTsKICAgICAgICB9KTsKICAgICAgICBhbnNQb3Auc3R5bGUuZGlzcGxheSA9ICJibG9jayI7CiAgICB9KQogICAgLmNhdGNoKGVycm9yID0+IHsKICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvcjonLCBlcnJvcik7CiAgICB9KS5maW5hbGx5KCgpID0+IHsKICAgICAgICBFeGl0TG9hZCgpOwogICAgfSk7CiAgICB9CiAgICAKICAgIGZ1bmN0aW9uIENsb3NlRWxlbSgpIHsKICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiYW5zd2VyUG9wIikuc3R5bGUuZGlzcGxheSA9ICJub25lIjsKICAgIH0KPC9zY3JpcHQ+");

//Init
const draggableElement = document.getElementById("draggableElement");
const hubbox = document.getElementById("hubbox");
makeDraggable(draggableElement);
document.getElementById("showHubbox").addEventListener("click", function() {
    makeDraggable(hubbox);
    hubbox.style.display = hubbox.style.display === "none" ? "block" : "none";
});
}())

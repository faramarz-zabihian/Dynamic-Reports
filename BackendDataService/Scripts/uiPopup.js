var currentPage = 1;


$(document).ready(function() {
   
    $("#windoPopup").css("width", "90%");
    $("#windoPopup").css("height", "700px");



    $("#btnGetPdf").click(function() {
        getPdf(copyOfObjReport);
    });
    $("#btnGetXlsx").click(function() {
        getExcel(copyOfObjReport);
    });

    $("#btnGetDoc").click(function() {
        getDoc(copyOfObjReport);
    });
    $("#nextPage").click(function() {
        var tmp = $("#dllCountRowPage").val();
        if (tmp == 9999)return false;
        currentPage = currentPage + 1;
        copyOfObjReport.execute(currentPage, currentPage, $("#dllCountRowPage").val(), 'result');
        $("#txtPageNumber").val(currentPage);
    });
    $("#prePage").click(function() {
        var tmp = $("#dllCountRowPage").val();
        if (tmp == 9999) return false;
        currentPage--;
        if (currentPage < 1) currentPage = 1;
        copyOfObjReport.execute(currentPage, currentPage, $("#dllCountRowPage").val(), 'result');
        $("#txtPageNumber").val(currentPage);
    });


    $("#btnGoToPage").click(function() {      
        var rowCount = $("#dllCountRowPage").val();
        if (rowCount == 9999)
            $("#txtPageNumber").val("1");
        var rowPage = $("#txtPageNumber").val();
        showPopup();
        copyOfObjReport.execute(rowPage, rowPage, rowCount, 'result');
    });
    $('#btnClosePopup').bind('click', function(e) {

        $("#windoPopup").bPopup().close();

    });
});
function showPopup() {

    $('#windoPopup').bPopup({
        fadeSpeed: 'slow', //can be a string ('slow'/'fast') or int
        followSpeed: 1500,
        modalClose: false,
        opacity: 0.6,
        positionStyle: 'fixed' //'fixed' or 'absolute'
    });
}
function getExcel() {
    ESS.service.JDownLoad("GetExcel", { r: copyOfObjReport }, true);
};
function getDoc() {
    ESS.service.JDownLoad("GetDoc", { r: copyOfObjReport }, true);
};
function getPdf() {
    ESS.service.JDownLoad("GetPdf", { r: copyOfObjReport }, true);
};
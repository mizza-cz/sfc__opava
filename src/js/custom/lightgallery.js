$(document).ready(function() {
   var a = !1;
   $("a[data-gallery]").click(function() {
       if (!a) {
           a = !0;
           var r = $(this).data("gallery"),
               s = $(this).data("start"),
               t = "/inc/gallery-ajax.php?mode=" + r;
           return 1 != r && 2 != r && 3 != r || (t += "&id=" + $(this).data("gallery-id")),
           $.getJSON(t, {
               format: "json"
           }).done(function(a) {
               $(this).lightGallery({
                   hash: !1,
                   share: !1,
                   dynamic: !0,
                   dynamicEl: a,
                   index: s,
                   download: !1,
                   backdropDuration: 500
               })
           }).fail(function(a, r, t) {
               alert("Nastala chyba při načítání galerie. Prosím zkuste to znovu."),
               console.error("getJSON failed, status: " + r + ", error: " + t),
               console.error(a)
           }).always(function() {
               a = !1
           }),
           !1
       }
   })
});
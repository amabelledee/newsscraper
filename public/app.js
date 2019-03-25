//JS FOR HANDLING COMMENTS ON ARTICLES

// // - Whenever someone clicks the comment button - // //
// $("#comment-btn").click(function(){
    // comment box pop up
//   });

    // AJAX call for article
    // $.ajax({
    //     method: "GET",
    //     url: "/articles/" + thisId
    // })
        // With that done, add the comment information on page
        // .then(function (data) {
        //     console.log(data);
        //     // The title of the article
        //     $("#notes").append("<h2>" + data.title + "</h2>");
        //     // An input to enter a new title
        //     $("#notes").append("<input id='titleinput' name='title' >");
        //     // A textarea to add a new note body
        //     $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        //     // A button to submit a new note, with the id of the article saved to it
        //     $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

//             // If there's a comment in the article //                        //
//             if (data.comment) {
//                 // Place the title of the note in the title input
//                 $("#titleinput").val(data.comment.title);
//                 // Place the body of the note in the body textarea
//                 $("#bodyinput").val(data.commente.body);
//             }
//         });
// });
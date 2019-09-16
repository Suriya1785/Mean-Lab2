/* This holds common function used to build dynamic javascripts across different sections
 * Author: HartCode Programmer
 * Date: 09/16/2019
 */

/* function is to create input tag and div based on passed parm 
 * @param: name (string) - name attribute for input tag  
 * @param: text (string) - html attribute for input tag  
 * @param: placeHolder (string) - placeholder attribute for input tag
 * @param: inputType (string) - input tag type data for input tag
 * Calls: None
 * called by: getRegTeam()
 */
function getInputDiv(name, text, placeHolder, inputType) {
    let inputDiv = $("<div>")
        .attr("class", "row offset-md-3 col-md-8 mt-1 form-inline")
        .append($("<label/>")
            .attr("class", "d-none d-md-inline col-md-3")
            .attr("for", name)
            .html(text))
        .append($("<input/>")
            .attr("class", "d-inline form-control col-md-6")
            .attr("name", name)
            .attr("id", name)
            .attr("placeholder", placeHolder)
            .attr("required", true)
            .attr("type", inputType))
    return inputDiv;
}


/* function is to generate the modal template.  
 * @param label (string) - set as modal label
 * @param id (string) - set as modal id
 * @param modalBodyId (string) - set as modal-body id for further adding content 
 * @param modalFooterId (string) - set as modal-footer id for further adding content 
 * calls: None
 * Called By: getDelTeam()
 */
function getModalTemplate(label, id, modalBodyId, modalFooterId) {

    let modalDiv = $("<div/>")
        .attr("class", "modal fade modal-lg")
        .attr("tabindex", "-1")
        .attr("role", "dialog")
        .attr("aria-labelledby", label)
        .attr("id", id)
        .attr("aria-hidden", true)
        .append($("<div/>")
            .attr("class", "modal-dialog modalSize")
            .attr("role", "document")
            .append($("<div/>")
                .attr("class", "modal-content")
                .append($("<div/>")
                    .attr("class", "modal-header")
                    .append($("<h5/>")
                        .attr("id", label)
                        .attr("class", "modal-title"))
                    .append($("<button/>")
                        .attr("class", "close")
                        .attr("data-dismiss", "modal")
                        .attr("aria-label", "close")
                        .append($("<span/>")
                            .attr("aria-hidden", true)
                            .html("&times;"))))
                .append($("<div/>")
                    .attr("class", "modal-body")
                    .attr("id", modalBodyId))
                .append($("<div/>")
                    .attr("class", "modal-footer")
                    .attr("id", modalFooterId))));
    return modalDiv;
}
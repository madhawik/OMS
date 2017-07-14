import { Reaction, i18next } from "/client/api";
import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";

/**
 * memberForm events
 *
 */
Template.memberForm.events({
  "submit form": function (event, template) {
    event.preventDefault();

    const newMemberEmail = template.$('input[name="email"]').val();
    const newMemberName = template.$('input[name="name"]').val();
    const newMemberStore = template.$('input[name="store"]').val();

    return Meteor.call("accounts/inviteShopMember", Reaction.getShopId(),
      newMemberEmail, newMemberName, newMemberStore, function (error, result) {
        if (error) {
          let message;
          if (error.reason === "Unable to send invitation email.") {
            message = i18next.t("accountsUI.error.unableToSendInvitationEmail");
          } else if (error.reason !== "") {
            message = error;
          } else {
            message = `${i18next.t("accountsUI.error.errorSendingEmail")
              } ${error}`;
          }
          Alerts.toast(message, "error", {
            html: true,
            timeout: 10000
          });
          return false;
        }
        if (result) {
          Alerts.toast(i18next.t("accountsUI.info.invitationSent",
            "Invitation sent."), "success");

          template.$("input[type=text], input[type=email]").val("");
          $(".settings-account-list").show();

          return true;
        }
      }
    );
  }
});

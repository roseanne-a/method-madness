const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;

const { addTeam } = require("../src/utils/api.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("registration")
    .setDescription(
      "Register your team! Only members' promotion link is optional."
    ),
  // .addStringOption((option) =>
  //   option
  //     .setName("team_name")
  //     .setDescription("Enter a team name.")
  //     .setRequired(true)
  // )
  // .addStringOption((option) =>
  //   option
  //     .setName("leader")
  //     .setDescription("Input your leader's name.")
  //     .setRequired(true)
  // )
  // .addStringOption((option) =>
  //   option
  //     .setName("leader_stream")
  //     .setDescription("Input leader's stream link (required).")
  //     .setRequired(true)
  // )
  // .addStringOption((option) =>
  //   option.setName("member1").setDescription("First team member's name.")
  // )
  // .addStringOption((option) =>
  //   option
  //     .setName("member1_promotion")
  //     .setDescription("Submit promotion link for first team member.")
  // )
  // .addStringOption((option) =>
  //   option.setName("member2").setDescription("Second team member's name.")
  // )
  // .addStringOption((option) =>
  //   option
  //     .setName("member2_promotion")
  //     .setDescription("Submit promotion link for second team member.")
  // )
  // .addStringOption((option) =>
  //   option.setName("member3").setDescription("Third team member's name.")
  // )
  // .addStringOption((option) =>
  //   option
  //     .setName("member3_promotion")
  //     .setDescription("Submit promotion link for third team member.")
  // )
  // .addStringOption((option) =>
  //   option
  //     .setName("mascot")
  //     .setDescription("Submit image link of team mascot")
  // )
  // //add do you need room

  async execute(interaction) {
    const filter = (response) => {
      return response.author.id === interaction.user.id;
    };

    let team;
    let leader;
    let leaderPromo;
    let memberOne;
    let memberOnePromo;
    let memberTwo;
    let memberTwoPromo;
    let memberThree;
    let memberThreePromo;
    let mascot;

    interaction
      .reply({
        content: "What is your team's name?",
        fetchReply: true,
        ephemeral: true,
      })
      .then(() => {
        interaction.channel
          .awaitMessages({ filter, max: 1, time: 30000, errors: ["time"] })
          .then((collected) => {
            team = collected.first().content;
            interaction.channel.messages.delete(
              interaction.channel.lastMessageId
            );
            // team leader
            interaction
              .editReply({
                content: `Team name set to: ${team}. Who is the team leader?`,
                fetchReply: true,
                ephemeral: true,
              })

              .then(() => {
                interaction.channel
                  .awaitMessages({
                    filter,
                    max: 1,
                    time: 30000,
                    errors: ["time"],
                  })
                  .then((collected) => {
                    leader = collected.first().content;
                    interaction.channel.messages.delete(
                      interaction.channel.lastMessageId
                    );
                    interaction.editReply({
                      content: `Team leader: ${leader}.`,
                      ephemeral: true,
                    });
                    //team leader promo
                    interaction
                      .editReply({
                        content: `What is the team leader's streaming link (Twitch, YouTube, etc)?`,

                        fetchReply: true,
                        ephemeral: true,
                      })
                      .then(() => {
                        interaction.channel
                          .awaitMessages({
                            filter,
                            max: 1,
                            time: 30000,
                            errors: ["time"],
                          })
                          .then((collected) => {
                            leaderPromo = collected.first().content;
                            interaction.channel.messages.delete(
                              interaction.channel.lastMessageId
                            );
                            interaction.editReply({
                              content: `Team leader promo: ${leaderPromo}.`,
                              ephemeral: true,
                            });
                            //team 1
                            interaction
                              .editReply({
                                content: `Who is the first team member?`,
                                fetchReply: true,
                                ephemeral: true,
                              })
                              .then(() => {
                                interaction.channel
                                  .awaitMessages({
                                    filter,
                                    max: 1,
                                    time: 30000,
                                    errors: ["time"],
                                  })
                                  .then((collected) => {
                                    memberOne = collected.first().content;
                                    interaction.channel.messages.delete(
                                      interaction.channel.lastMessageId
                                    );
                                    interaction.editReply({
                                      content: `First team member: ${memberOne}.`,
                                      ephemeral: true,
                                    });
                                    //team 1 promo
                                    interaction
                                      .editReply({
                                        content: `What is the first team members's promo link? If none, please type "none".`,
                                        fetchReply: true,
                                        ephemeral: true,
                                      })
                                      .then(() => {
                                        interaction.channel
                                          .awaitMessages({
                                            filter,
                                            max: 1,
                                            time: 30000,
                                            errors: ["time"],
                                          })
                                          .then((collected) => {
                                            memberOnePromo =
                                              collected.first().content;
                                            interaction.channel.messages.delete(
                                              interaction.channel.lastMessageId
                                            );
                                            interaction.editReply({
                                              content: `First member promo: ${memberOnePromo}.`,
                                              ephemeral: true,
                                            });
                                            //team 2
                                            interaction
                                              .editReply({
                                                content: `Who is the second team member?`,
                                                fetchReply: true,
                                                ephemeral: true,
                                              })
                                              .then(() => {
                                                interaction.channel
                                                  .awaitMessages({
                                                    filter,
                                                    max: 1,
                                                    time: 30000,
                                                    errors: ["time"],
                                                  })
                                                  .then((collected) => {
                                                    memberTwo =
                                                      collected.first().content;
                                                    interaction.channel.messages.delete(
                                                      interaction.channel
                                                        .lastMessageId
                                                    );
                                                    interaction.editReply({
                                                      content: `Second team member: ${memberTwo}.`,
                                                      ephemeral: true,
                                                    });
                                                    //team 2 promo
                                                    interaction
                                                      .editReply({
                                                        content: `What is the second team members's promo link? If none, please type "none".`,
                                                        fetchReply: true,
                                                        ephemeral: true,
                                                      })
                                                      .then(() => {
                                                        interaction.channel
                                                          .awaitMessages({
                                                            filter,
                                                            max: 1,
                                                            time: 30000,
                                                            errors: ["time"],
                                                          })
                                                          .then((collected) => {
                                                            memberTwoPromo =
                                                              collected.first()
                                                                .content;
                                                            interaction.channel.messages.delete(
                                                              interaction
                                                                .channel
                                                                .lastMessageId
                                                            );
                                                            interaction.editReply(
                                                              {
                                                                content: `Second team member promo: ${memberTwoPromo}.`,
                                                                ephemeral: true,
                                                              }
                                                            );
                                                            //team 3
                                                            interaction
                                                              .editReply({
                                                                content: `Who is the third team member?`,
                                                                fetchReply: true,
                                                                ephemeral: true,
                                                              })
                                                              .then(() => {
                                                                interaction.channel
                                                                  .awaitMessages(
                                                                    {
                                                                      filter,
                                                                      max: 1,
                                                                      time: 30000,
                                                                      errors: [
                                                                        "time",
                                                                      ],
                                                                    }
                                                                  )
                                                                  .then(
                                                                    (
                                                                      collected
                                                                    ) => {
                                                                      memberThree =
                                                                        collected.first()
                                                                          .content;
                                                                      interaction.channel.messages.delete(
                                                                        interaction
                                                                          .channel
                                                                          .lastMessageId
                                                                      );
                                                                      interaction.editReply(
                                                                        {
                                                                          content: `Third team member: ${memberThree}.`,
                                                                          ephemeral: true,
                                                                        }
                                                                      );
                                                                      //team 3 promo
                                                                      interaction
                                                                        .editReply(
                                                                          {
                                                                            content: `What is the third team members's promo link? If none, please type "none".`,
                                                                            fetchReply: true,
                                                                            ephemeral: true,
                                                                          }
                                                                        )
                                                                        .then(
                                                                          () => {
                                                                            interaction.channel
                                                                              .awaitMessages(
                                                                                {
                                                                                  filter,
                                                                                  max: 1,
                                                                                  time: 30000,
                                                                                  errors:
                                                                                    [
                                                                                      "time",
                                                                                    ],
                                                                                }
                                                                              )
                                                                              .then(
                                                                                (
                                                                                  collected
                                                                                ) => {
                                                                                  memberThreePromo =
                                                                                    collected.first()
                                                                                      .content;
                                                                                  interaction.channel.messages.delete(
                                                                                    interaction
                                                                                      .channel
                                                                                      .lastMessageId
                                                                                  );
                                                                                  interaction.editReply(
                                                                                    {
                                                                                      content: `Third member promo: ${memberThreePromo}.`,
                                                                                      ephemeral: true,
                                                                                    }
                                                                                  );
                                                                                  //mascot
                                                                                  wait(
                                                                                    2000
                                                                                  );
                                                                                  interaction
                                                                                    .editReply(
                                                                                      {
                                                                                        content: `What is your team mascot? (Please provide a link. If you do not have a mascot, please type "none".)`,
                                                                                        fetchReply: true,
                                                                                        ephemeral: true,
                                                                                      }
                                                                                    )
                                                                                    .then(
                                                                                      () => {
                                                                                        interaction.channel
                                                                                          .awaitMessages(
                                                                                            {
                                                                                              filter,
                                                                                              max: 1,
                                                                                              time: 30000,
                                                                                              errors:
                                                                                                [
                                                                                                  "time",
                                                                                                ],
                                                                                            }
                                                                                          )
                                                                                          .then(
                                                                                            (
                                                                                              collected
                                                                                            ) => {
                                                                                              mascot =
                                                                                                collected.first()
                                                                                                  .content;
                                                                                              interaction.channel.messages.delete(
                                                                                                interaction
                                                                                                  .channel
                                                                                                  .lastMessageId
                                                                                              );
                                                                                              interaction
                                                                                                .editReply(
                                                                                                  {
                                                                                                    content: `Team Mascot: ${mascot}`,
                                                                                                    ephemeral: true,
                                                                                                  }
                                                                                                )
                                                                                                .then(
                                                                                                  () => {
                                                                                                    const teamRegistration =
                                                                                                      {
                                                                                                        team,
                                                                                                        leader,
                                                                                                        leaderPromo,
                                                                                                        memberOne,
                                                                                                        memberOnePromo,
                                                                                                        memberTwo,
                                                                                                        memberTwoPromo,
                                                                                                        memberThree,
                                                                                                        memberThreePromo,
                                                                                                        mascot,
                                                                                                        approved: false,
                                                                                                        hide: false,
                                                                                                      };
                                                                                                    addTeam(
                                                                                                      teamRegistration
                                                                                                    );
                                                                                                    interaction.editReply(
                                                                                                      {
                                                                                                        content: `The team is now awaiting mod approval! If you need a channel to communicate with your members, please reach out to a mod member.`,
                                                                                                        ephemeral: true,
                                                                                                      }
                                                                                                    );
                                                                                                  }
                                                                                                )
                                                                                                .catch(
                                                                                                  () => {
                                                                                                    console.log(
                                                                                                      "Time ran out or there was an error."
                                                                                                    );
                                                                                                  }
                                                                                                )

                                                                                                .catch(
                                                                                                  (
                                                                                                    collected
                                                                                                  ) => {
                                                                                                    interaction.editReply(
                                                                                                      {
                                                                                                        content:
                                                                                                          "Time ran out or there was an error. Please try again!",
                                                                                                        ephemeral: true,
                                                                                                      }
                                                                                                    );
                                                                                                  }
                                                                                                );
                                                                                            }
                                                                                          )
                                                                                          .catch(
                                                                                            (
                                                                                              collected
                                                                                            ) => {
                                                                                              interaction.editReply(
                                                                                                {
                                                                                                  content:
                                                                                                    "Time ran out or there was an error. Please try again!",
                                                                                                  ephemeral: true,
                                                                                                }
                                                                                              );
                                                                                            }
                                                                                          );
                                                                                      }
                                                                                    )
                                                                                    .catch(
                                                                                      (
                                                                                        collected
                                                                                      ) => {
                                                                                        interaction.editReply(
                                                                                          {
                                                                                            content:
                                                                                              "Time ran out or there was an error. Please try again!",
                                                                                            ephemeral: true,
                                                                                          }
                                                                                        );
                                                                                      }
                                                                                    );
                                                                                }
                                                                              );
                                                                          }
                                                                        )
                                                                        .catch(
                                                                          (
                                                                            collected
                                                                          ) => {
                                                                            interaction.editReply(
                                                                              {
                                                                                content:
                                                                                  "Time ran out or there was an error. Please try again!",
                                                                                ephemeral: true,
                                                                              }
                                                                            );
                                                                          }
                                                                        );
                                                                    }
                                                                  )
                                                                  .catch(
                                                                    (
                                                                      collected
                                                                    ) => {
                                                                      interaction.editReply(
                                                                        {
                                                                          content:
                                                                            "Time ran out or there was an error. Please try again!",
                                                                          ephemeral: true,
                                                                        }
                                                                      );
                                                                    }
                                                                  );
                                                              })
                                                              .catch(
                                                                (collected) => {
                                                                  interaction.editReply(
                                                                    {
                                                                      content:
                                                                        "Time ran out or there was an error. Please try again!",
                                                                      ephemeral: true,
                                                                    }
                                                                  );
                                                                }
                                                              );
                                                          })
                                                          .catch(
                                                            (collected) => {
                                                              interaction.editReply(
                                                                {
                                                                  content:
                                                                    "Time ran out or there was an error. Please try again!",
                                                                  ephemeral: true,
                                                                }
                                                              );
                                                            }
                                                          );
                                                      })
                                                      .catch((collected) => {
                                                        interaction.editReply({
                                                          content:
                                                            "Time ran out or there was an error. Please try again!",
                                                          ephemeral: true,
                                                        });
                                                      });
                                                  })
                                                  .catch((collected) => {
                                                    interaction.editReply({
                                                      content:
                                                        "Time ran out or there was an error. Please try again!",
                                                      ephemeral: true,
                                                    });
                                                  });
                                              })
                                              .catch((collected) => {
                                                interaction.editReply({
                                                  content:
                                                    "Time ran out or there was an error. Please try again!",
                                                  ephemeral: true,
                                                });
                                              });
                                          })
                                          .catch((collected) => {
                                            interaction.editReply({
                                              content:
                                                "Time ran out or there was an error. Please try again!",
                                              ephemeral: true,
                                            });
                                          });
                                      })
                                      .catch((collected) => {
                                        interaction.editReply({
                                          content:
                                            "Time ran out or there was an error. Please try again!",
                                          ephemeral: true,
                                        });
                                      });
                                  })
                                  .catch((collected) => {
                                    interaction.editReply({
                                      content:
                                        "Time ran out or there was an error. Please try again!",
                                      ephemeral: true,
                                    });
                                  });
                              })
                              .catch((collected) => {
                                interaction.editReply({
                                  content:
                                    "Time ran out or there was an error. Please try again!",
                                  ephemeral: true,
                                });
                              });
                          })
                          .catch((collected) => {
                            interaction.editReply({
                              content:
                                "Time ran out or there was an error. Please try again!",
                              ephemeral: true,
                            });
                          });
                      })
                      .catch((collected) => {
                        interaction.editReply({
                          content:
                            "Time ran out or there was an error. Please try again!",
                          ephemeral: true,
                        });
                      });
                  })
                  .catch((collected) => {
                    interaction.editReply({
                      content:
                        "Time ran out or there was an error. Please try again!",
                      ephemeral: true,
                    });
                  });
              })
              .catch((collected) => {
                interaction.editReply({
                  content:
                    "Time ran out or there was an error. Please try again!",
                  ephemeral: true,
                });
              });
          });
      })
      .catch((collected) => {
        interaction.editReply({
          content: "Time ran out or there was an error. Please try again!",
          ephemeral: true,
        });
      });

    // let team_name = interaction.options.getString("team_name");
    // let leader = interaction.options.getString("leader");
    // let leader_stream = interaction.options.getString("leader_stream");
    // let member1 = interaction.options.getString("member1");
    // let member1_promotion = interaction.options.getString("member1_promotion");
    // let member2 = interaction.options.getString("member2");
    // let member2_promotion = interaction.options.getString("member2_promotion");
    // let member3 = interaction.options.getString("member3");
    // let member3_promotion = interaction.options.getString("member3_promotion");
    // let mascot = interaction.options.getString("mascot");

    // if (!mascot) mascot = "https://i.imgur.com/Xx3hHU4.gif";

    // const newTeam = {
    //   team_name,
    //   leader,
    //   leader_stream,
    //   member1,
    //   member1_promotion,
    //   member2,
    //   member2_promotion,
    //   member3,
    //   member3_promotion,
    //   mascot,
    //   approved: false,
    // };
  },
};

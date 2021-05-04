import { store } from "../..";
import { Project_States } from "../../Constants";

export function calculateProjectsStatistics(theme) {
  const state = store.getState();
  const projects = state.projects.dataArray;
  var projectsStats = {};
  for (let p of projects) {
    switch (p.etat) {
      case Project_States.accepted:
        projectsStats[Project_States.accepted] = {
          count: projectsStats[Project_States.accepted]
            ? projectsStats[Project_States.accepted].count + 1
            : 1,
          mainColor: theme.palette.success.main,
          hoverColor: theme.palette.success.dark,
        };
        break;
      case Project_States.refused:
        projectsStats[Project_States.refused] = {
          count: projectsStats[Project_States.refused]
            ? projectsStats[Project_States.refused].count + 1
            : 1,
          mainColor: theme.palette.error.main,
          hoverColor: theme.palette.error.dark,
        };
        break;
      case Project_States.waiting:
        if (p.id_etudiant || p.id_etudiant_2) {
          projectsStats["Proposé par étudiant"] = {
            count: projectsStats["Proposé par étudiant"]
              ? projectsStats["Proposé par étudiant"].count + 1
              : 1,
            mainColor: theme.palette.warning.main,
            hoverColor: theme.palette.warning.dark,
          };
        } else {
          projectsStats[Project_States.waiting] = {
            count: projectsStats[Project_States.waiting]
              ? projectsStats[Project_States.waiting].count + 1
              : 1,
            mainColor: theme.palette.warning.light,
            hoverColor: theme.palette.warning.dark,
          };
        }
        break;
    }
  }

  const labels = Object.keys(projectsStats).map((p) => p);
  const backgroundColor = labels.map((p) => projectsStats[p].mainColor);
  const hoverBackgroundColor = labels.map((p) => projectsStats[p].hoverColor);
  const data = labels.map((p) => projectsStats[p].count);

  const _state = {
    title: "Statistiques des etats des sujets",
    data: {
      labels,
      datasets: [
        {
          label: "Projets",
          backgroundColor,
          hoverBackgroundColor,
          data,
        },
      ],
    },
  };

  return _state;
}

export function calculateGeneral(theme) {
  const state = store.getState();
  const students = state.users.all.filter((u) => u.role === "etudiant");
  const teachers = state.users.all.filter((u) => u.role === "etudiant");
  const members = state.users.all.filter((u) => u.role === "etudiant");
  const projects = state.projects.dataArray;
  const candidatures = state.candidatures;
  const soutenances = [];

  const all = {
    students: {
      count: students.length,
      backgroundColor: theme.palette.primary.light,
      borderColor: theme.palette.primary.dark,
    },
    teachers: {
      count: teachers.length + members.length,
      backgroundColor: theme.palette.success.light,
      borderColor: theme.palette.success.dark,
    },
    members: {
      count: members.length,
      backgroundColor: theme.palette.warning.light,
      borderColor: theme.palette.warning.dark,
    },
    projects: {
      count: projects.length,
      backgroundColor: theme.palette.secondary.light,
      borderColor: theme.palette.secondary.dark,
    },
    candidatures: {
      count: candidatures.length,
      backgroundColor: theme.palette.error.light,
      borderColor: theme.palette.error.dark,
    },
    soutenances: {
      count: soutenances.length,
      backgroundColor: theme.palette.primary.light,
      borderColor: theme.palette.primary.dark,
    },
  };

  const _state = {
    labels: Object.keys(all),
    datasets: [
      {
        label: "Statistiques générales",
        backgroundColor: Object.keys(all).map((k) => all[k].backgroundColor),
        borderColor: Object.keys(all).map((k) => all[k].borderColor),
        borderWidth: 2,
        data: Object.keys(all).map((k) => all[k].count),
      },
    ],
    options: {
      legend: {
        display: false,
      },
    },
  };

  return _state;
}

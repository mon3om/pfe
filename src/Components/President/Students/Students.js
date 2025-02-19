import {
  Checkbox,
  Chip,
  Collapse,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CahierState from "../../Commun/ViewProjects/CahierState";
import { getProjectByID } from "../../Enseignant/Candidatures/logic";
// import { sendReminderForStudentsNotifications } from "../../../Notifications";
import TableToolbar from "./TableToolbar";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

function Students(props) {
  const users = useSelector((state) => state.users.all);
  var students = users.filter((u) => u.role === "etudiant");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const theme = useTheme();

  const classes = useRowStyles();

  const sliceStart =
    page * rowsPerPage < students.length ? page * rowsPerPage : 0;
  const sliceEnd =
    page * rowsPerPage + rowsPerPage < students.length
      ? page * rowsPerPage + rowsPerPage
      : students.length;

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSelectTeacher = (id) => {
    if (selectedStudents.indexOf(id) === -1) {
      setSelectedStudents([...selectedStudents, id]);
    } else {
      setSelectedStudents(selectedStudents.filter((st) => st !== id));
    }
  };

  const handleSelectAllStudents = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
      return;
    }
    var selected = [];
    for (let student of students) selected.push(student.id_utilisateur);

    setSelectedStudents(selected);
  };

  var selected = [];
  for (let student of students) selected.push(student.id_utilisateur);

  const selectStudentsWithoutTags = () => {
    var _selected = [];
    for (let t of students)
      if (t.tags.length < 1 && selectedStudents.indexOf(t) < 0)
        _selected.push(t.id_utilisateur);

    setSelectedStudents(_selected);
  };

  const selectStudentsWithoutDates = () => {
    var _selected = [];
    for (let t of students)
      if (t.dates.length < 1 && selectedStudents.indexOf(t) < 0)
        _selected.push(t.id_utilisateur);

    setSelectedStudents(_selected);
  };

  function notify(isForTags) {
    // sendReminderForStudentsNotifications(
    //   users.current,
    //   selectedStudents,
    //   isForTags
    // )
    //   .then(() => {
    //     var message = isForTags
    //       ? "Notifications pour tags envoyés"
    //       : "Notifications pour dates envoyés";
    //     dispatch({
    //       type: "OPEN_SNACK",
    //       payload: { message, type: "success" },
    //     });
    //   })
    //   .catch((err) => console.error(err));
  }

  return (
    <div className="table-container">
      <Typography variant="h4">Liste des étudiants</Typography>
      <TableContainer component="div">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Sujet affecté</TableCell>
              <TableCell>Lieu</TableCell>
              <TableCell>Cahier des charges</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.slice(sliceStart, sliceEnd).map((student) => {
              const project = getProjectByID(student.sujet_affecte);

              return (
                <React.Fragment>
                  <TableRow className={classes.root}>
                    <TableCell padding="checkbox"></TableCell>
                    <TableCell>{student.nom}</TableCell>

                    <TableCell>
                      {project ? (
                        <Tooltip
                          title={"Cliquer pour visualiser - " + project.titre}
                        >
                          <div>
                            <Link
                              className="link-style"
                              to={`?pid=${project.id_sujet}`}
                            >
                              <Chip
                                size="small"
                                label="Sujet affecté"
                                style={{
                                  backgroundColor: theme.palette.success.main,
                                  color: "black",
                                }}
                              />
                            </Link>
                          </div>
                        </Tooltip>
                      ) : (
                        <Chip
                          size="small"
                          label="Aucun sujet"
                          style={{
                            backgroundColor: theme.palette.error.main,
                            color: "white",
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell>{project ? project.lieu : ""}</TableCell>
                    <TableCell>
                      {project ? <CahierState project={project} /> : ""}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell padding="checkbox" />
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={5}
                    ></TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[6, 10, 20, 50]}
        component="div"
        count={students.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default Students;

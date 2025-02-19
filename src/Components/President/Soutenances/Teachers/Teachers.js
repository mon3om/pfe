import {
  Button,
  Checkbox,
  Chip,
  Collapse,
  Divider,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  useTheme,
} from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { sendReminderForTeachersNotifications } from "../../../../Notifications";
import TableToolbar from "./TableToolbar";
import { Link } from "react-router-dom";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

function Teachers(props) {
  const calledFromSoutenances = props.calledFromSoutenances;
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  var teachers = useSelector((state) => state.soutenance.teachers);
  const values = useSelector((state) => state.soutenance.values);
  const [showTags, setShowTags] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [selectedTeachers, setSelectedTeachers] = useState(
    calledFromSoutenances ? values.selectedTeachers : []
  );
  const theme = useTheme();

  const classes = useRowStyles();

  const sliceStart =
    page * rowsPerPage < teachers.length ? page * rowsPerPage : 0;
  const sliceEnd =
    page * rowsPerPage + rowsPerPage < teachers.length
      ? page * rowsPerPage + rowsPerPage
      : teachers.length;

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSelectTeacher = (id) => {
    if (selectedTeachers.indexOf(id) === -1) {
      setSelectedTeachers([...selectedTeachers, id]);
      if (calledFromSoutenances)
        dispatch({
          type: "UPDATE_VALUES",
          payload: {
            prop: "selectedTeachers",
            value: [...selectedTeachers, id],
          },
        });
    } else {
      setSelectedTeachers(selectedTeachers.filter((st) => st !== id));
      if (calledFromSoutenances)
        dispatch({
          type: "UPDATE_VALUES",
          payload: {
            prop: "selectedTeachers",
            value: selectedTeachers.filter((st) => st !== id),
          },
        });
    }
  };

  const handleSelectPresident = (id) => {
    var selected = values.presidents;
    if (selected.indexOf(id) < 0) selected.push(id);
    else selected = selected.filter((s) => s !== id);

    dispatch({
      type: "UPDATE_VALUES",
      payload: {
        prop: "presidents",
        value: selected,
      },
    });
  };

  const handleSelectAllTeachers = () => {
    if (selectedTeachers.length === teachers.length) {
      setSelectedTeachers([]);
      if (calledFromSoutenances)
        dispatch({
          type: "UPDATE_VALUES",
          payload: { prop: "selectedTeachers", value: [] },
        });
      return;
    }
    var selected = [];
    for (let teacher of teachers) selected.push(teacher.id_utilisateur);

    setSelectedTeachers(selected);
    if (calledFromSoutenances)
      dispatch({
        type: "UPDATE_VALUES",
        payload: { prop: "selectedTeachers", value: selected },
      });
  };

  const selectTeachersWithoutTags = () => {
    var _selected = [];
    for (let t of teachers)
      if (t.tags.length < 1 && selectedTeachers.indexOf(t) < 0)
        _selected.push(t.id_utilisateur);

    setSelectedTeachers(_selected);
  };

  const selectTeachersWithoutDates = () => {
    var _selected = [];
    for (let t of teachers)
      if (t.dates.length < 1 && selectedTeachers.indexOf(t) < 0)
        _selected.push(t.id_utilisateur);

    setSelectedTeachers(_selected);
  };

  function notify(isForTags) {
    sendReminderForTeachersNotifications(
      users.current,
      selectedTeachers,
      isForTags
    )
      .then(() => {
        var message = isForTags
          ? "Notifications pour tags envoyés"
          : "Notifications pour dates envoyés";
        dispatch({
          type: "OPEN_SNACK",
          payload: { message, type: "success" },
        });
      })
      .catch((err) => console.error(err));
  }

  return (
    <div className="table-container" style={{ marginTop: "1rem" }}>
      <TableContainer component="div">
        <TableToolbar
          calledFromSoutenances={calledFromSoutenances}
          notify={notify}
          selected={selectedTeachers}
          setShowTags={setShowTags}
          showTags={showTags}
          selectTeachersWithoutTags={selectTeachersWithoutTags}
          selectTeachersWithoutDates={selectTeachersWithoutDates}
          setSelectedTeachers={setSelectedTeachers}
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedTeachers.length > 0 &&
                    selectedTeachers.length < teachers.length
                  }
                  checked={
                    teachers.length > 0 &&
                    selectedTeachers.length === teachers.length
                  }
                  onChange={() => handleSelectAllTeachers()}
                />
              </TableCell>
              <TableCell>Nom</TableCell>
              {calledFromSoutenances && <TableCell>Président</TableCell>}
              <TableCell>email</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>Préférences</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.slice(sliceStart, sliceEnd).map((teacher) => (
              <React.Fragment>
                <TableRow className={classes.root} role="checkbox">
                  <TableCell
                    onClick={() => handleSelectTeacher(teacher.id_utilisateur)}
                    padding="checkbox"
                  >
                    <Checkbox
                      checked={
                        selectedTeachers.indexOf(teacher.id_utilisateur) > -1
                      }
                    />
                  </TableCell>
                  <TableCell
                    onClick={() => handleSelectTeacher(teacher.id_utilisateur)}
                  >
                    {teacher.nom}
                  </TableCell>
                  {calledFromSoutenances && (
                    <TableCell
                      onClick={() =>
                        handleSelectPresident(teacher.id_utilisateur)
                      }
                    >
                      <Checkbox
                        checked={
                          values.presidents.indexOf(teacher.id_utilisateur) > -1
                        }
                      />
                    </TableCell>
                  )}

                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>
                    <Chip
                      style={{
                        backgroundColor:
                          teacher.tags.length > 0
                            ? theme.palette.success.main
                            : "",
                        color: teacher.tags.length > 0 ? "black" : "",
                      }}
                      variant={!teacher.tags.length ? "outlined" : "default"}
                      label={teacher.tags.length}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      style={{
                        backgroundColor:
                          teacher.dates.length > 0
                            ? theme.palette.success.light
                            : "",
                        color: teacher.dates.length > 0 ? "black" : "",
                      }}
                      variant={!teacher.dates.length ? "outlined" : "default"}
                      label={teacher.dates.length}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell padding="checkbox" />
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={5}
                  >
                    <Collapse in={showTags}>
                      <div className="horizontal-list">
                        <div
                          style={{
                            paddingBottom: "1rem",
                            flex: "1 1 49%",
                            minWidth: "16rem",
                          }}
                        >
                          Tags
                          <div className="horizontal-list">
                            {teacher.tags.map((tag) => (
                              <Chip
                                variant="outlined"
                                size="small"
                                label={tag.id_tag}
                              />
                            ))}
                          </div>
                        </div>
                        <Divider orientation="vertical" flexItem />
                        <div
                          style={{
                            paddingBottom: "1rem",
                            flex: "1 1 49%",
                            minWidth: "16rem",
                          }}
                        >
                          Préférences
                          <div className="horizontal-list">
                            {teacher.dates.map((date) => (
                              <Chip
                                variant="outlined"
                                size="small"
                                label={date.jour + ": " + date.crenaux}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[6, 10, 20, 50]}
        component="div"
        count={teachers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default Teachers;

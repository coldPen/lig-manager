import type { AttendanceType } from "@prisma/client";
import type { DetailedClass } from "domain/types/class";
import type {
  AttendanceStatus,
  ClassAttendance,
} from "domain/types/classAttendance";
import { useId } from "react";
import { Form } from "react-router";
import { match } from "ts-pattern";
import { Badge, type BadgeProps } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  attendanceStatusLabels,
  attendanceTypeLabels,
  levelLabels,
} from "~/constants/labels";

export function AttendanceList({ class_ }: { class_: DetailedClass }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>
            Élèves de niveau {levelLabels[class_.level.name]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {class_.attendances.regular.map((attendance) => (
              <Badge key={attendance.id}>
                {`${attendance.student.firstName} ${attendance.student.lastName}`}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      {class_.attendances.visitor.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Visiteurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {class_.attendances.visitor.map((attendance) => {
                // attendance.status
                return (
                  <Badge key={attendance.id} variant="secondary">
                    {`${attendance.student.firstName} ${attendance.student.lastName}`}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
  // return (
  //   <Table className="table-fixed w-3/4">
  //     <TableHeader>
  //       <TableRow>
  //         <TableHead>Élève</TableHead>
  //         <TableHead>Statut</TableHead>
  //       </TableRow>
  //     </TableHeader>
  //     <TableBody>
  //       {class_.attendances.map((attendance) => (
  //         <AttendanceRow key={attendance.id} {...attendance} />
  //       ))}
  //     </TableBody>
  //   </Table>
  // )
}

// const typeBadgeVariants: Record<AttendanceType, BadgeProps["variant"]> = {
//   REGULAR: "outline",
//   VISITOR: "secondary",
// }

// const statusBadgeVariants: Record<AttendanceStatus, BadgeProps["variant"]> = {
//   PLANNED: "default",
//   ABSENT: "secondary",
//   CANCELLED: "destructive",
// }

// function AttendanceRow({ id, type, status, student }: ClassAttendance) {
//   const formId = useId()

//   const studentName = `${student.firstName} ${student.lastName}`

//   return (
//     <TableRow>
//       <TableCell>
//         <div className="flex items-center gap-4">
//           {studentName}
//           <Badge variant={typeBadgeVariants[type]} className="capitalize">
//             {attendanceTypeLabels[type]}
//           </Badge>
//         </div>
//       </TableCell>
//       <TableCell>
//         <div className="flex items-center gap-4">
//           <Badge variant={statusBadgeVariants[status]} className="capitalize">
//             {attendanceStatusLabels[status]}
//           </Badge>
//           {type === "VISITOR" && (
//             <Form method="post" id={formId}>
//               <input type="hidden" name="attendanceId" value={id} />
//             </Form>
//           )}
//         </div>
//       </TableCell>
//     </TableRow>
//   )
// }

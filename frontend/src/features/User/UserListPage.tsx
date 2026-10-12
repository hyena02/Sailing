
import { useEffect, useState } from "react";
import { getUsers, type User } from "./userApi";

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((err: unknown) => {
        setError(
          err instanceof Error
            ? err.message
            : "회원 목록을 불러오지 못했습니다."
        );
      });
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main style={{ padding: "32px" }}>
      <h1>SAILING 회원 목록</h1>

      {users.length === 0 ? (
        <p>회원 정보를 불러오는 중입니다...</p>
      ) : (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>번호</th>
              <th>아이디</th>
              <th>이름</th>
              <th>이메일</th>
              <th>회원 유형</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId}>
                <td>{user.userId}</td>
                <td>{user.loginId}</td>
                <td>{user.name}</td>
                <td>{user.email ?? "-"}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
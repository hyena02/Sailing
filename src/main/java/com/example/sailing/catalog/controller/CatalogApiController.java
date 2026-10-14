package com.example.sailing.catalog.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(
    origins = "http://localhost:5173",
    allowCredentials = "true"
)
public class CatalogApiController {

    private final JdbcTemplate jdbcTemplate;

    public CatalogApiController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // 1. 채용공고 목록 GET /api/jobs

    private static final String JOB_SELECT = """
        SELECT
            j.JOB_ID AS jobId,
            j.COMPANY_INFO_ID AS companyInfoId,
            c.COMPANY_NAME AS companyName,
            c.LOGO_IMAGE AS companyLogo,
            j.TITLE AS title,
            j.POSITION_NAME AS positionName,
            j.VESSEL_TYPE AS vesselType,
            j.LOCATION AS location,
            j.SALARY AS salary,
            CASE WHEN j.SALARY_VISIBLE = 1
                 THEN TRUE ELSE FALSE END AS salaryVisible,
            j.EXPERIENCE AS experience,
            j.EMPLOYMENT_TYPE AS employmentType,
            j.WORK_SCHEDULE AS workSchedule,
            j.DUTIES AS duties,
            j.REQUIREMENTS AS requirements,
            j.DESCRIPTION AS description,
            j.RECRUITMENT_STEPS AS recruitmentSteps,
            j.DEADLINE_DATE AS deadlineDate,
            CASE WHEN j.IS_ALWAYS_OPEN = 1
                 THEN TRUE ELSE FALSE END AS isAlwaysOpen,
            j.JOB_STATUS AS jobStatus,
            j.VIEW_COUNT AS viewCount,
            j.CREATED_AT AS createdAt
        FROM JOBS j
        JOIN COMPANY_INFO c
          ON c.COMPANY_INFO_ID = j.COMPANY_INFO_ID
        """;

    @GetMapping("/jobs")
    public List<Map<String, Object>> getJobs() {
        String sql = JOB_SELECT + """
            WHERE j.JOB_STATUS <> 'DRAFT'
            ORDER BY j.CREATED_AT DESC
            """;

        return jdbcTemplate.queryForList(sql);
    }

    // 2. 채용공고 상세 GET /api/jobs/1

    @GetMapping("/jobs/{jobId}")
    public ResponseEntity<Map<String, Object>> getJob(
            @PathVariable Long jobId) {

        String sql = JOB_SELECT + """
            WHERE j.JOB_ID = ?
              AND j.JOB_STATUS <> 'DRAFT'
            """;

        List<Map<String, Object>> rows =
            jdbcTemplate.queryForList(sql, jobId);

        if (rows.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(rows.get(0));
    }

    // 3. 해운정보 / 인재정보 목록 GET /api/talents
    @GetMapping("/talents")
    public List<Map<String, Object>> getTalents() {

        String sql = """
            SELECT
                i.USER_INFO_ID AS userInfoId,
                i.USER_ID AS userId,
                i.NICKNAME AS nickname,
                u.NAME AS name,
                i.INTRODUCTION AS introduction,
                NULL AS positionName,
                NULL AS experience,
                NULL AS desiredLocation,
                CASE
                    WHEN i.NATIONALITY = 'DOMESTIC'
                        THEN '내국인'
                    WHEN i.NATIONALITY = 'FOREIGN'
                        THEN '외국인'
                    ELSE i.NATIONALITY
                END AS nationality,
                NULL AS skills,
                i.CREATED_AT AS createdAt
            FROM USER_INFO i
            JOIN USERS u
              ON u.USER_ID = i.USER_ID
            WHERE u.ROLE = 'USER'
              AND u.STATUS = 'ACTIVE'
            ORDER BY i.CREATED_AT DESC
            """;

        return jdbcTemplate.queryForList(sql);
    }

    // 4. 한인선식 / 업체 목록 GET /api/stores
    private static final String STORE_SELECT = """
        SELECT
            s.STORE_INFO_ID AS storeInfoId,
            s.STORE_INFO_ID AS storeId,
            s.STORE_NAME AS storeName,
            s.REPRESENTATIVE AS representative,
            s.ADDRESS AS address,
            s.REGION AS region,
            s.SERVICE_COUNTRY AS serviceCountry,
            s.HOMEPAGE AS homepage,
            u.PHONE AS phone,
            u.EMAIL AS email,
            s.SERVICE_PORTS AS servicePorts,
            s.SERVICE_DETAILS AS serviceDetails,
            s.REMARKS AS remarks,
            s.LOGO_IMAGE AS logoImage,
            s.FEATURE_IMAGE AS featureImage,
            s.INTRODUCTION AS introduction,
            s.VERIFICATION_STATUS AS verificationStatus,
            s.CREATED_AT AS createdAt
        FROM STORE_INFO s
        JOIN USERS u
          ON u.USER_ID = s.USER_ID
        """;

    @GetMapping("/stores")
    public List<Map<String, Object>> getStores() {

        String sql = STORE_SELECT + """
            WHERE s.VERIFICATION_STATUS = 'APPROVED'
              AND u.STATUS = 'ACTIVE'
            ORDER BY s.CREATED_AT DESC
            """;

        return jdbcTemplate.queryForList(sql);
    }


    // 5. 한인선식 / 업체 상세 GET /api/stores/1

    @GetMapping("/stores/{storeId}")
    public ResponseEntity<Map<String, Object>> getStore(
            @PathVariable Long storeId) {

        String sql = STORE_SELECT + """
            WHERE s.STORE_INFO_ID = ?
              AND s.VERIFICATION_STATUS = 'APPROVED'
              AND u.STATUS = 'ACTIVE'
            """;

        List<Map<String, Object>> rows =
            jdbcTemplate.queryForList(sql, storeId);

        if (rows.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(rows.get(0));
    }
}

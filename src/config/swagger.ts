import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Online Appointment Booking API",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost:3000/api" }],
    tags: [
      { name: "System" },
      { name: "Auth" },
      { name: "Users" },
      { name: "Specialties" },
      { name: "Doctors" },
      { name: "Appointments" },
      { name: "Admin" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Validation error" },
            error: { nullable: true },
          },
          required: ["success", "message"],
        },
        UserPublic: {
          type: "object",
          properties: {
            id: { type: "string" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string", format: "email" },
            role: { type: "string", enum: ["PATIENT", "DOCTOR", "ADMIN"] },
            phoneNumber: { type: "string", nullable: true },
            profileImage: { type: "string", nullable: true },
            isActive: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
          required: ["id", "firstName", "lastName", "email", "role", "isActive", "createdAt", "updatedAt"],
        },
        AuthRegisterRequest: {
          type: "object",
          properties: {
            firstName: { type: "string", example: "Jane" },
            lastName: { type: "string", example: "Doe" },
            email: { type: "string", format: "email", example: "jane@example.com" },
            password: { type: "string", example: "ChangeMe123!" },
            phoneNumber: { type: "string", nullable: true, example: "+254700000000" },
            role: { type: "string", enum: ["PATIENT", "DOCTOR"], example: "PATIENT" },
            specialtyId: { type: "string", nullable: true, description: "Required when role=DOCTOR" },
          },
          required: ["firstName", "lastName", "email", "password"],
        },
        AuthRegisterResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Registered" },
            data: {
              type: "object",
              properties: {
                id: { type: "string" },
                email: { type: "string", format: "email" },
                role: { type: "string", enum: ["PATIENT", "DOCTOR", "ADMIN"] },
                firstName: { type: "string" },
                lastName: { type: "string" },
                createdAt: { type: "string", format: "date-time" },
              },
              required: ["id", "email", "role", "firstName", "lastName", "createdAt"],
            },
          },
          required: ["success", "message", "data"],
        },
        AuthLoginRequest: {
          type: "object",
          properties: {
            email: { type: "string", format: "email", example: "jane@example.com" },
            password: { type: "string", example: "ChangeMe123!" },
          },
          required: ["email", "password"],
        },
        AuthUser: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string", format: "email" },
            role: { type: "string", enum: ["PATIENT", "DOCTOR", "ADMIN"] },
            firstName: { type: "string" },
            lastName: { type: "string" },
          },
          required: ["id", "email", "role", "firstName", "lastName"],
        },
        AuthLoginResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Logged in" },
            data: {
              type: "object",
              properties: {
                user: { $ref: "#/components/schemas/AuthUser" },
                accessToken: { type: "string" },
              },
              required: ["user", "accessToken"],
            },
          },
          required: ["success", "message", "data"],
        },
        PaginationMeta: {
          type: "object",
          properties: {
            page: { type: "integer", example: 1 },
            limit: { type: "integer", example: 10 },
            total: { type: "integer", example: 0 },
          },
          required: ["page", "limit", "total"],
        },
        MeResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Me" },
            data: { $ref: "#/components/schemas/UserPublic" },
          },
          required: ["success", "message", "data"],
        },
        UpdateMeRequest: {
          type: "object",
          properties: {
            firstName: { type: "string" },
            lastName: { type: "string" },
            phoneNumber: { type: "string" },
            profileImage: { type: "string", format: "uri" },
          },
        },
        SpecialtySummary: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
          },
          required: ["id", "name"],
        },
        SpecialtyPublic: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            description: { type: "string", nullable: true },
          },
          required: ["id", "name"],
        },
        SpecialtiesResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Specialties" },
            data: {
              type: "object",
              properties: {
                items: { type: "array", items: { $ref: "#/components/schemas/SpecialtyPublic" } },
              },
              required: ["items"],
            },
          },
          required: ["success", "message", "data"],
        },
        DoctorUserSummary: {
          type: "object",
          properties: {
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string", format: "email" },
            profileImage: { type: "string", nullable: true },
          },
          required: ["firstName", "lastName", "email"],
        },
        DoctorListItem: {
          type: "object",
          properties: {
            id: { type: "string" },
            bio: { type: "string", nullable: true },
            experienceYears: { type: "integer" },
            consultationFee: { type: "integer", nullable: true },
            clinicAddress: { type: "string", nullable: true },
            rating: { type: "number" },
            user: { $ref: "#/components/schemas/DoctorUserSummary" },
            specialty: { $ref: "#/components/schemas/SpecialtySummary" },
          },
          required: ["id", "experienceYears", "rating", "user", "specialty"],
        },
        DoctorsListResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Doctors" },
            data: {
              type: "object",
              properties: {
                items: { type: "array", items: { $ref: "#/components/schemas/DoctorListItem" } },
                page: { type: "integer" },
                limit: { type: "integer" },
                total: { type: "integer" },
              },
              required: ["items", "page", "limit", "total"],
            },
          },
          required: ["success", "message", "data"],
        },
        DoctorDetail: {
          allOf: [
            { $ref: "#/components/schemas/DoctorListItem" },
            {
              type: "object",
              properties: {
                specialty: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    description: { type: "string", nullable: true },
                  },
                  required: ["id", "name"],
                },
              },
            },
          ],
        },
        DoctorDetailResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Doctor" },
            data: { $ref: "#/components/schemas/DoctorDetail" },
          },
          required: ["success", "message", "data"],
        },
        AvailabilitySlotInput: {
          type: "object",
          properties: {
            startTime: { type: "string", format: "date-time" },
            endTime: { type: "string", format: "date-time" },
          },
          required: ["startTime", "endTime"],
        },
        CreateAvailabilityRequest: {
          type: "object",
          properties: {
            slots: {
              type: "array",
              items: { $ref: "#/components/schemas/AvailabilitySlotInput" },
            },
          },
          required: ["slots"],
        },
        CreateAvailabilityResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Availability created" },
            data: {
              type: "object",
              properties: { createdCount: { type: "integer", example: 1 } },
              required: ["createdCount"],
            },
          },
          required: ["success", "message", "data"],
        },
        AvailabilitySlotPublic: {
          type: "object",
          properties: {
            id: { type: "string" },
            startTime: { type: "string", format: "date-time" },
            endTime: { type: "string", format: "date-time" },
          },
          required: ["id", "startTime", "endTime"],
        },
        DoctorAvailabilityResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Availability" },
            data: {
              type: "object",
              properties: {
                items: { type: "array", items: { $ref: "#/components/schemas/AvailabilitySlotPublic" } },
              },
              required: ["items"],
            },
          },
          required: ["success", "message", "data"],
        },
        UpdateDoctorProfileRequest: {
          type: "object",
          properties: {
            specialtyId: { type: "string" },
            bio: { type: "string" },
            experienceYears: { type: "integer" },
            consultationFee: { type: "integer" },
            clinicAddress: { type: "string" },
          },
        },
        UpdateDoctorProfileResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Doctor profile updated" },
            data: {
              type: "object",
              properties: {
                id: { type: "string" },
                specialtyId: { type: "string" },
                bio: { type: "string", nullable: true },
                experienceYears: { type: "integer" },
                consultationFee: { type: "integer", nullable: true },
                clinicAddress: { type: "string", nullable: true },
                rating: { type: "number" },
                updatedAt: { type: "string", format: "date-time" },
              },
              required: ["id", "specialtyId", "experienceYears", "rating", "updatedAt"],
            },
          },
          required: ["success", "message", "data"],
        },
        AppointmentStatus: {
          type: "string",
          enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "REJECTED"],
        },
        CreateAppointmentRequest: {
          type: "object",
          properties: {
            slotId: { type: "string" },
            notes: { type: "string", nullable: true },
          },
          required: ["slotId"],
        },
        CreateAppointmentResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Appointment booked" },
            data: {
              type: "object",
              properties: {
                id: { type: "string" },
                status: { $ref: "#/components/schemas/AppointmentStatus" },
                appointmentDate: { type: "string", format: "date-time" },
              },
              required: ["id", "status", "appointmentDate"],
            },
          },
          required: ["success", "message", "data"],
        },
        DoctorAppointmentItem: {
          type: "object",
          properties: {
            id: { type: "string" },
            status: { $ref: "#/components/schemas/AppointmentStatus" },
            appointmentDate: { type: "string", format: "date-time" },
            notes: { type: "string", nullable: true },
            slot: {
              type: "object",
              properties: {
                startTime: { type: "string", format: "date-time" },
                endTime: { type: "string", format: "date-time" },
              },
              required: ["startTime", "endTime"],
            },
            patient: {
              type: "object",
              properties: {
                id: { type: "string" },
                firstName: { type: "string" },
                lastName: { type: "string" },
                email: { type: "string", format: "email" },
              },
              required: ["id", "firstName", "lastName", "email"],
            },
          },
          required: ["id", "status", "appointmentDate", "slot", "patient"],
        },
        DoctorAppointmentsResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Doctor appointments" },
            data: {
              type: "object",
              properties: {
                items: { type: "array", items: { $ref: "#/components/schemas/DoctorAppointmentItem" } },
              },
              required: ["items"],
            },
          },
          required: ["success", "message", "data"],
        },
        MyAppointmentItem: {
          type: "object",
          properties: {
            id: { type: "string" },
            status: { $ref: "#/components/schemas/AppointmentStatus" },
            appointmentDate: { type: "string", format: "date-time" },
            notes: { type: "string", nullable: true },
            cancellationReason: { type: "string", nullable: true },
            slot: {
              type: "object",
              properties: {
                startTime: { type: "string", format: "date-time" },
                endTime: { type: "string", format: "date-time" },
              },
              required: ["startTime", "endTime"],
            },
            doctor: {
              type: "object",
              properties: {
                id: { type: "string" },
                specialty: {
                  type: "object",
                  properties: { name: { type: "string" } },
                  required: ["name"],
                },
                user: {
                  type: "object",
                  properties: {
                    firstName: { type: "string" },
                    lastName: { type: "string" },
                    email: { type: "string", format: "email" },
                  },
                  required: ["firstName", "lastName", "email"],
                },
              },
              required: ["id", "specialty", "user"],
            },
          },
          required: ["id", "status", "appointmentDate", "slot", "doctor"],
        },
        MyAppointmentsResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "My appointments" },
            data: {
              type: "object",
              properties: {
                items: { type: "array", items: { $ref: "#/components/schemas/MyAppointmentItem" } },
                page: { type: "integer" },
                limit: { type: "integer" },
                total: { type: "integer" },
              },
              required: ["items", "page", "limit", "total"],
            },
          },
          required: ["success", "message", "data"],
        },
        CancelAppointmentRequest: {
          type: "object",
          properties: { cancellationReason: { type: "string" } },
          required: ["cancellationReason"],
        },
        UpdateAppointmentStatusRequest: {
          type: "object",
          properties: { status: { $ref: "#/components/schemas/AppointmentStatus" } },
          required: ["status"],
        },
        SimpleAppointmentStatusResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Status updated" },
            data: {
              type: "object",
              properties: {
                id: { type: "string" },
                status: { $ref: "#/components/schemas/AppointmentStatus" },
              },
              required: ["id", "status"],
            },
          },
          required: ["success", "message", "data"],
        },
        AdminUserListItem: {
          type: "object",
          properties: {
            id: { type: "string" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string", format: "email" },
            role: { type: "string", enum: ["PATIENT", "DOCTOR", "ADMIN"] },
            isActive: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
          },
          required: ["id", "firstName", "lastName", "email", "role", "isActive", "createdAt"],
        },
        AdminUsersResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Users" },
            data: {
              type: "object",
              properties: {
                items: { type: "array", items: { $ref: "#/components/schemas/AdminUserListItem" } },
                page: { type: "integer" },
                limit: { type: "integer" },
                total: { type: "integer" },
              },
              required: ["items", "page", "limit", "total"],
            },
          },
          required: ["success", "message", "data"],
        },
        AdminSuspendRequest: {
          type: "object",
          properties: { isActive: { type: "boolean" } },
          required: ["isActive"],
        },
        AdminSuspendResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "User updated" },
            data: {
              type: "object",
              properties: { id: { type: "string" }, isActive: { type: "boolean" } },
              required: ["id", "isActive"],
            },
          },
          required: ["success", "message", "data"],
        },
        CreateSpecialtyRequest: {
          type: "object",
          properties: { name: { type: "string" }, description: { type: "string", nullable: true } },
          required: ["name"],
        },
        CreateSpecialtyResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Specialty created" },
            data: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                description: { type: "string", nullable: true },
                createdAt: { type: "string", format: "date-time" },
              },
              required: ["id", "name", "createdAt"],
            },
          },
          required: ["success", "message", "data"],
        },
        AnalyticsResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Analytics" },
            data: {
              type: "object",
              properties: {
                users: { type: "integer" },
                doctors: { type: "integer" },
                apptsByStatus: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      status: { $ref: "#/components/schemas/AppointmentStatus" },
                      _count: { type: "object" },
                    },
                    required: ["status", "_count"],
                  },
                },
              },
              required: ["users", "doctors", "apptsByStatus"],
            },
          },
          required: ["success", "message", "data"],
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["src/**/*.routes.ts", "src/**/*.controller.ts", "src/app.ts"],
});

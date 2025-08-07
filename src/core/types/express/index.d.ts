import { User as PrismaUser, Role as PrismaRole } from '@prisma/client';

declare global {
    namespace Express {
        export type UserWithRoles = PrismaUser & {
            roles: PrismaRole[];
        };

        export interface Request {
            user?: UserWithRoles;
        }
    }
}
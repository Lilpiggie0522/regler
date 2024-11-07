import { POST } from '@/app/api/staff/readCsv/route'
import { NextRequest, NextResponse } from 'next/server';
import * as t from '@/app/api/adminSystem/initialise/dbInitialisation';

describe("api tests for data processing", () => {
    let mockCsvData: string
    let mockFile: File
    let formData: FormData
    let req: NextRequest

    beforeEach(() => {
        mockCsvData = 'Name,zid,group Name,Class,mentor,group_id,group_id2,email,mentor_email,course_admin,admin_email\
\npiggie0,z1234567,piggie squad0,T13B,Piggie,z1234567,T13B_Piggie0,z1234567@student.unsw.edu.au,z2232322@unsw.edu.au,real_piggie,z5414078@ad.unsw.edu.au\n\
piggie1,z1234568,piggie squad0,T13B,Piggie,z1234568,T13B_Piggie0,z1234568@student.unsw.edu.au,z2232322@unsw.edu.au,,\n\
piggie2,z1234569,piggie squad0,T13B,Piggie,z1234569,T13B_Piggie0,z1234569@student.unsw.edu.au,z2232322@unsw.edu.au,,\n\
piggie3,z1234570,piggie squad0,T13B,Piggie,z1234570,T13B_Piggie0,z1234570@student.unsw.edu.au,z2232322@unsw.edu.au,,\n\
piggie4,z1234571,piggie squad1,T13B,Piggie1,z1234571,T13B_Piggie1,z1234571@student.unsw.edu.au,z2232323@unsw.edu.au,,\n\
piggie5,z1234572,piggie squad1,T13B,Piggie1,z1234572,T13B_Piggie1,z1234572@student.unsw.edu.au,z2232323@unsw.edu.au,,\n\
piggie6,z1234573,piggie squad1,T13B,Piggie1,z1234573,T13B_Piggie1,z1234573@student.unsw.edu.au,z2232323@unsw.edu.au,,\n\
piggie7,z1234574,piggie squad1,T13B,Piggie1,z1234574,T13B_Piggie1,z1234574@student.unsw.edu.au,z2232323@unsw.edu.au,,\n\
piggie8,z1234575,piggie squad1,T13B,Piggie1,z1234575,T13B_Piggie1,z1234575@student.unsw.edu.au,z2232323@unsw.edu.au,,\n\
doggie0,z1234576,doggie squad0,T21A,Doggie,z1234576,T21A_Doggie0,z1234576@student.unsw.edu.au,z2232324@unsw.edu.au,,\n\
doggie1,z1234577,doggie squad0,T21A,Doggie,z1234577,T21A_Doggie0,z1234577@student.unsw.edu.au,z2232324@unsw.edu.au,,\n\
doggie2,z1234578,doggie squad0,T21A,Doggie,z1234578,T21A_Doggie0,z1234578@student.unsw.edu.au,z2232324@unsw.edu.au,,\n\
doggie3,z1234579,doggie squad0,T21A,Doggie,z1234579,T21A_Doggie0,z1234579@student.unsw.edu.au,z2232324@unsw.edu.au,,\n\
Jeffrey,z5414078,jeffrey squad,T22A,Danny,z5414078,T22A_Danny,belikov9519@gmail.com,cowhorse3900@outlook.com,,\n\
Wilson,z5423255,jeffrey squad,T22A,Danny,z5423255,T22A_Danny,wilsonzhu2003@gmail.com,cowhorse3900@outlook.com,,\n\
Guojing,z5450260,jeffrey squad,T22A,Danny,z5450260,T22A_Danny,z5450260@ad.unsw.edu.au,cowhorse3900@outlook.com,,\n\
Rocky,z5349042,jeffrey squad,T22A,Danny,z5349042,T22A_Danny,z5349042@ad.unsw.edu.au,cowhorse3900@outlook.com,,\n\
Ruiqi,z5361545,jeffrey squad,T22A,Danny,z5361545,T22A_Danny,z5361545@ad.unsw.edu.au,cowhorse3900@outlook.com,,\n\
Waner,z5417505,jeffrey squad,T22A,Danny,z5417505,T22A_Danny,z5417505@ad.unsw.edu.au,cowhorse3900@outlook.com,,\n\
'
        jest.spyOn(t, 'dbInitialization').mockReturnValue(Promise.resolve(NextResponse.json('ok', {status: 200})))
    })

    it("should return converted data with a 200 response", async () => {

        mockFile = new File([mockCsvData], 'COMP3900_24T3_OHYEAH.csv', { type: 'text/csv' });
        formData = new FormData()
        formData.append('csv', mockFile)
        req = new NextRequest(new URL('http://localhost:3000/api/staff/readCsv'), {
            method: 'POST',
            body: formData,
        })
        const res = await POST(req)
        const result = await res.json()
        expect(res.status).toBe(200)
        const expected = [
            {
                name: 'piggie0',
                zid: 'z1234567',
                groupname: 'piggie squad0',
                class: 'T13B',
                mentor: 'Piggie',
                group_id: 'z1234567',
                group_id2: 'T13B_Piggie0',
                email: 'z1234567@student.unsw.edu.au',
                mentor_email: 'z2232322@unsw.edu.au',
                course_admin: 'real_piggie',
                admin_email: 'z5414078@ad.unsw.edu.au'
            },
            {
                name: 'piggie1',
                zid: 'z1234568',
                groupname: 'piggie squad0',
                class: 'T13B',
                mentor: 'Piggie',
                group_id: 'z1234568',
                group_id2: 'T13B_Piggie0',
                email: 'z1234568@student.unsw.edu.au',
                mentor_email: 'z2232322@unsw.edu.au',
                course_admin: '',
                admin_email: ''
            },
            {
                name: 'piggie2',
                zid: 'z1234569',
                groupname: 'piggie squad0',
                class: 'T13B',
                mentor: 'Piggie',
                group_id: 'z1234569',
                group_id2: 'T13B_Piggie0',
                email: 'z1234569@student.unsw.edu.au',
                mentor_email: 'z2232322@unsw.edu.au',
                course_admin: '',
                admin_email: ''
            },
            {
                name: 'piggie3',
                zid: 'z1234570',
                groupname: 'piggie squad0',
                class: 'T13B',
                mentor: 'Piggie',
                group_id: 'z1234570',
                group_id2: 'T13B_Piggie0',
                email: 'z1234570@student.unsw.edu.au',
                mentor_email: 'z2232322@unsw.edu.au',
                course_admin: '',
                admin_email: ''
            },
            {
                name: 'piggie4',
                zid: 'z1234571',
                groupname: 'piggie squad1',
                class: 'T13B',
                mentor: 'Piggie1',
                group_id: 'z1234571',
                group_id2: 'T13B_Piggie1',
                email: 'z1234571@student.unsw.edu.au',
                mentor_email: 'z2232323@unsw.edu.au',
                course_admin: '',
                admin_email: ''
            },
            {
                name: 'piggie5',
                zid: 'z1234572',
                groupname: 'piggie squad1',
                class: 'T13B',
                mentor: 'Piggie1',
                group_id: 'z1234572',
                group_id2: 'T13B_Piggie1',
                email: 'z1234572@student.unsw.edu.au',
                mentor_email: 'z2232323@unsw.edu.au',
                course_admin: '',
                admin_email: ''
            },
            {
                name: 'piggie6',
                zid: 'z1234573',
                groupname: 'piggie squad1',
                class: 'T13B',
                mentor: 'Piggie1',
                group_id: 'z1234573',
                group_id2: 'T13B_Piggie1',
                email: 'z1234573@student.unsw.edu.au',
                mentor_email: 'z2232323@unsw.edu.au',
                course_admin: '',
                admin_email: ''
            },
            {
                name: 'piggie7',
                zid: 'z1234574',
                groupname: 'piggie squad1',
                class: 'T13B',
                mentor: 'Piggie1',
                group_id: 'z1234574',
                group_id2: 'T13B_Piggie1',
                email: 'z1234574@student.unsw.edu.au',
                mentor_email: 'z2232323@unsw.edu.au',
                course_admin: '',
                admin_email: ''
            },
            {
                name: 'piggie8',
                zid: 'z1234575',
                groupname: 'piggie squad1',
                class: 'T13B',
                mentor: 'Piggie1',
                group_id: 'z1234575',
                group_id2: 'T13B_Piggie1',
                email: 'z1234575@student.unsw.edu.au',
                mentor_email: 'z2232323@unsw.edu.au',
                course_admin: '',
                admin_email: ''
            },
            {
                name: 'doggie0',
                zid: 'z1234576',
                groupname: 'doggie squad0',
                class: 'T21A',
                mentor: 'Doggie',
                group_id: 'z1234576',
                group_id2: 'T21A_Doggie0',
                email: 'z1234576@student.unsw.edu.au',
                mentor_email: 'z2232324@unsw.edu.au',
                course_admin: '',
                admin_email: ''
            },
            {
                name: 'doggie1',
                zid: 'z1234577',
                groupname: 'doggie squad0',
                class: 'T21A',
                mentor: 'Doggie',
                group_id: 'z1234577',
                group_id2: 'T21A_Doggie0',
                email: 'z1234577@student.unsw.edu.au',
                mentor_email: 'z2232324@unsw.edu.au',
                course_admin: '',
                admin_email: ''
            },
            {
                name: 'doggie2',
                zid: 'z1234578',
                groupname: 'doggie squad0',
                class: 'T21A',
                mentor: 'Doggie',
                group_id: 'z1234578',
                group_id2: 'T21A_Doggie0',
                email: 'z1234578@student.unsw.edu.au',
                mentor_email: 'z2232324@unsw.edu.au',
                course_admin: '',
                admin_email: ''
            },
            {
                name: 'doggie3',
                zid: 'z1234579',
                groupname: 'doggie squad0',
                class: 'T21A',
                mentor: 'Doggie',
                group_id: 'z1234579',
                group_id2: 'T21A_Doggie0',
                email: 'z1234579@student.unsw.edu.au',
                mentor_email: 'z2232324@unsw.edu.au',
                course_admin: '',
                admin_email: ''
            },
            {
                name: 'Jeffrey',
                zid: 'z5414078',
                groupname: 'jeffrey squad',
                class: 'T22A',
                mentor: 'Danny',
                group_id: 'z5414078',
                group_id2: 'T22A_Danny',
                email: 'belikov9519@gmail.com',
                mentor_email: 'cowhorse3900@outlook.com',
                course_admin: '',
                admin_email: ''
            },
            {
                name: 'Wilson',
                zid: 'z5423255',
                groupname: 'jeffrey squad',
                class: 'T22A',
                mentor: 'Danny',
                group_id: 'z5423255',
                group_id2: 'T22A_Danny',
                email: 'wilsonzhu2003@gmail.com',
                mentor_email: 'cowhorse3900@outlook.com',
                course_admin: '',
                admin_email: ''
            },
            {
                name: 'Guojing',
                zid: 'z5450260',
                groupname: 'jeffrey squad',
                class: 'T22A',
                mentor: 'Danny',
                group_id: 'z5450260',
                group_id2: 'T22A_Danny',
                email: 'z5450260@ad.unsw.edu.au',
                mentor_email: 'cowhorse3900@outlook.com',
                course_admin: '',
                admin_email: ''
            },
            {
                name: 'Rocky',
                zid: 'z5349042',
                groupname: 'jeffrey squad',
                class: 'T22A',
                mentor: 'Danny',
                group_id: 'z5349042',
                group_id2: 'T22A_Danny',
                email: 'z5349042@ad.unsw.edu.au',
                mentor_email: 'cowhorse3900@outlook.com',
                course_admin: '',
                admin_email: ''
            },
            {
                name: 'Ruiqi',
                zid: 'z5361545',
                groupname: 'jeffrey squad',
                class: 'T22A',
                mentor: 'Danny',
                group_id: 'z5361545',
                group_id2: 'T22A_Danny',
                email: 'z5361545@ad.unsw.edu.au',
                mentor_email: 'cowhorse3900@outlook.com',
                course_admin: '',
                admin_email: ''
            },
            {
                name: 'Waner',
                zid: 'z5417505',
                groupname: 'jeffrey squad',
                class: 'T22A',
                mentor: 'Danny',
                group_id: 'z5417505',
                group_id2: 'T22A_Danny',
                email: 'z5417505@ad.unsw.edu.au',
                mentor_email: 'cowhorse3900@outlook.com',
                course_admin: '',
                admin_email: ''
            }
        ]
        expect(result).toEqual(expected)
    })

    it("should return a 400 error since no coursename provided", async () => {
        mockFile = new File([mockCsvData], 'no_coursename_no_term.csv', { type: 'text/csv' });
        formData = new FormData()
        formData.append('csv', mockFile)
        req = new NextRequest(new URL('http://localhost:3000/api/staff/readCsv'), {
            method: 'POST',
            body: formData,
        })
        const res = await POST(req)
        const result = await res.json()
        expect(res.status).toBe(400)
        expect(result).toEqual("Please include course name in title")
    })

    it("should return a 400 error since no coursecode provided", async () => {
        mockFile = new File([mockCsvData], 'COMP3900_no_term.csv', { type: 'text/csv' });
        formData = new FormData()
        formData.append('csv', mockFile)
        req = new NextRequest(new URL('http://localhost:3000/api/staff/readCsv'), {
            method: 'POST',
            body: formData,
        })
        const res = await POST(req)
        const result = await res.json()
        expect(res.status).toBe(400)
        expect(result).toEqual("Please include course term in title")
    })

    it("should return http error 400 since zid is missing for one row, piggie 1 zid missing", async () => {
        mockCsvData = 'Name,zid,group Name,Class,mentor,group_id,group_id2,email,mentor_email,course_admin,admin_email\
\npiggie0,z1234567,piggie squad0,T13B,Piggie,z1234567,T13B_Piggie0,z1234567@student.unsw.edu.au,z2232322@unsw.edu.au,real_piggie,z5414078@ad.unsw.edu.au\n\
piggie1,,piggie squad0,T13B,Piggie,z1234568,T13B_Piggie0,z1234568@student.unsw.edu.au,z2232322@unsw.edu.au,,\n\
piggie2,z1234569,piggie squad0,T13B,Piggie,z1234569,T13B_Piggie0,z1234569@student.unsw.edu.au,z2232322@unsw.edu.au,,\n\
piggie3,z1234570,piggie squad0,T13B,Piggie,z1234570,T13B_Piggie0,z1234570@student.unsw.edu.au,z2232322@unsw.edu.au,,\n\
piggie4,z1234571,piggie squad1,T13B,Piggie1,z1234571,T13B_Piggie1,z1234571@student.unsw.edu.au,z2232323@unsw.edu.au,,\n\
piggie5,z1234572,piggie squad1,T13B,Piggie1,z1234572,T13B_Piggie1,z1234572@student.unsw.edu.au,z2232323@unsw.edu.au,,\n\
piggie6,z1234573,piggie squad1,T13B,Piggie1,z1234573,T13B_Piggie1,z1234573@student.unsw.edu.au,z2232323@unsw.edu.au,,\n\
piggie7,z1234574,piggie squad1,T13B,Piggie1,z1234574,T13B_Piggie1,z1234574@student.unsw.edu.au,z2232323@unsw.edu.au,,\n\
piggie8,z1234575,piggie squad1,T13B,Piggie1,z1234575,T13B_Piggie1,z1234575@student.unsw.edu.au,z2232323@unsw.edu.au,,\n\
doggie0,z1234576,doggie squad0,T21A,Doggie,z1234576,T21A_Doggie0,z1234576@student.unsw.edu.au,z2232324@unsw.edu.au,,\n\
doggie1,z1234577,doggie squad0,T21A,Doggie,z1234577,T21A_Doggie0,z1234577@student.unsw.edu.au,z2232324@unsw.edu.au,,\n\
doggie2,z1234578,doggie squad0,T21A,Doggie,z1234578,T21A_Doggie0,z1234578@student.unsw.edu.au,z2232324@unsw.edu.au,,\n\
doggie3,z1234579,doggie squad0,T21A,Doggie,z1234579,T21A_Doggie0,z1234579@student.unsw.edu.au,z2232324@unsw.edu.au,,\n\
Jeffrey,z5414078,jeffrey squad,T22A,Danny,z5414078,T22A_Danny,belikov9519@gmail.com,cowhorse3900@outlook.com,,\n\
Wilson,z5423255,jeffrey squad,T22A,Danny,z5423255,T22A_Danny,wilsonzhu2003@gmail.com,cowhorse3900@outlook.com,,\n\
Guojing,z5450260,jeffrey squad,T22A,Danny,z5450260,T22A_Danny,z5450260@ad.unsw.edu.au,cowhorse3900@outlook.com,,\n\
Rocky,z5349042,jeffrey squad,T22A,Danny,z5349042,T22A_Danny,z5349042@ad.unsw.edu.au,cowhorse3900@outlook.com,,\n\
Ruiqi,z5361545,jeffrey squad,T22A,Danny,z5361545,T22A_Danny,z5361545@ad.unsw.edu.au,cowhorse3900@outlook.com,,\n\
Waner,z5417505,jeffrey squad,T22A,Danny,z5417505,T22A_Danny,z5417505@ad.unsw.edu.au,cowhorse3900@outlook.com,,\n\
'
        mockFile = new File([mockCsvData], 'COMP3900_24T3OHYEAH.csv', { type: 'text/csv' });
        formData = new FormData()
        formData.append('csv', mockFile)
        req = new NextRequest(new URL('http://localhost:3000/api/staff/readCsv'), {
            method: 'POST',
            body: formData,
        })
        const res = await POST(req)
        const result = await res.json()
        expect(res.status).toBe(400)
        expect(result).toEqual("Rows contain empty values, please check the csv file provided!")
    })

    it("should return http 500 error, since something is wrong from initialise api", async () => {
        jest.spyOn(t, 'dbInitialization').mockReturnValue(Promise.resolve(NextResponse.json('something is wrong', {status: 500})))
        mockFile = new File([mockCsvData], 'COMP3900_24T3OHYEAH.csv', { type: 'text/csv' });
        formData = new FormData()
        formData.append('csv', mockFile)
        req = new NextRequest(new URL('http://localhost:3000/api/staff/readCsv'), {
            method: 'POST',
            body: formData,
        })
        const res = await POST(req)
        const result = await res.json()
        expect(res.status).toBe(500)
        expect(result).toEqual("something is wrong")
    })

    it("should return http 400 error, because wrong file type was attached", async () => {
        global.fetch = jest.fn(() => {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({}),
            })
        }
        ) as jest.Mock;

        mockFile = new File([mockCsvData], 'COMP3900_24T3OHYEAH.txt', { type: 'text' });
        formData = new FormData()
        formData.append('txt', mockFile)
        req = new NextRequest(new URL('http://localhost:3000/api/staff/readCsv'), {
            method: 'POST',
            body: formData,
        })
        const res = await POST(req)
        const result = await res.json()
        expect(res.status).toBe(400)
        expect(result).toEqual("Incorrect file type or no file attached")
    })

    it("should return http 400 error, because no file was attached", async () => {
        global.fetch = jest.fn(() => {
            return Promise.resolve({
                ok: false,
                json: () => Promise.resolve({}),
            })
        }
        ) as jest.Mock;

        req = new NextRequest(new URL('http://localhost:3000/api/staff/readCsv'), {
            method: 'POST',
            body: new FormData()
        })
        const res = await POST(req)
        const result = await res.json()
        expect(res.status).toBe(400)
        expect(result).toEqual("Incorrect file type or no file attached")
    })
})
// import { Grid2 } from "@mui/material";

// export default function yellowPage() {
//     return (
//         <Grid2 container sx={{ minHeight: '100vh' }}>
//             <Grid2 container size={{ xs: 12, md: 7 }}>
//             </Grid2>
//             <Grid2 container size={{ xs: 12, md: 5 }}>
//                 <div className="bg-yellow-400 h-full w-full flex items-center justify-center">
//                     <div className="flex flex-col">
//                         <div className="flex flex-row">
//                             <div className="w-20">zid:</div>
//                             <input placeholder="    zid" type="text" className="rounded-md"/>
//                         </div>
//                         <div className="flex flex-row mt-2">
//                             <div className="w-20">password:</div>
//                             <input placeholder="    pwd" type="text" className="rounded-md"/>
//                         </div>
//                     </div>
//                 </div>
//             </Grid2>
//         </Grid2>
//     );
// }
import { Grid2 } from "@mui/material";

export default function yellowPage() {
    return (
        <Grid2 container sx={{ minHeight: '100vh' }}>
            <Grid2 container size={{ xs: 12, md: 7 }}>
                {/* Additional content can be added here */}
            </Grid2>
            <Grid2 container size={{ xs: 12, md: 5 }}>
                <div className="bg-yellow-400 h-full w-full flex items-center justify-center">
                    <div className="flex flex-col">
                        <div className="flex flex-row">
                            <div className="w-20">zid:</div>
                            <input placeholder="    zid" type="text" className="rounded-md" />
                        </div>
                        <div className="flex flex-row mt-2">
                            <div className="w-20">password:</div>
                            <input placeholder="    pwd" type="text" className="rounded-md" />
                        </div>
                    </div>
                </div>
            </Grid2>
        </Grid2>
    );
}


// import { Grid2 } from "@mui/material";

// export default function yellowPage() {
//     return (
//         <div className="flex flex-row">
//             <Grid2 container size={{ xs: 12, md: 7 }} sx={{ height: '100vh' }}>
//             </Grid2>
//             <Grid2 container size={{ xs: 12, md: 5 }} sx={{ height: '100vh' }}>
//                 <div className="bg-yellow-400 h-full w-full flex items-center justify-center">
//                     klsdf
//                 </div>
//             </Grid2>
//         </div>
//     );
// }

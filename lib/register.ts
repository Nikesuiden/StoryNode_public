// // /pages/api/register.ts
// import { NextApiRequest, NextApiResponse } from 'next';
// import prisma from '@/lib/prisma';
// import { supabase } from '@/lib/supabaseClient';

// export default async function EmailChecker(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const { email, password } = req.body;

//     // Prisma で既存のメールアドレスを確認
//     const existingUser = await prisma.user.findUnique({
//       where: { email: email },
//     });

//     if (existingUser) {
//       return res.status(400).json({ error: 'このメールアドレスは既に使用されています。' });
//     }

//     // 新規ユーザー登録処理
//     const { user, error } = await supabase.auth.signUp({ email, password });

//     if (error) {
//       return res.status(500).json({ error: error.message });
//     }

//     return res.status(200).json({ message: '登録が成功しました。' });
//   } else {
//     res.setHeader('Allow', ['POST']);
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

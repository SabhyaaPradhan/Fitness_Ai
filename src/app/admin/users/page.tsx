'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collectionGroup, query } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, UserX } from 'lucide-react';
import type { UserProfile } from '@/models/user-profile';
import { format } from 'date-fns';
import { useMemo } from 'react';

// Simplified model for the account data we need
interface UserAccount {
  id: string;
  email: string;
  registrationDate: any; // Can be Timestamp or string
}

// Combined view model for our table
interface CombinedUser extends UserProfile, Partial<UserAccount> {}

export default function AdminUsersPage() {
  const firestore = useFirestore();

  const profilesQuery = useMemoFirebase(
    () => query(collectionGroup(firestore, 'profile')),
    [firestore]
  );
  const accountsQuery = useMemoFirebase(
    () => query(collectionGroup(firestore, 'account')),
    [firestore]
  );

  const { data: profiles, isLoading: isLoadingProfiles, error: profilesError } = useCollection<UserProfile>(profilesQuery);
  const { data: accounts, isLoading: isLoadingAccounts, error: accountsError } = useCollection<UserAccount>(accountsQuery);

  const { combinedUsers, isLoading, error } = useMemo(() => {
    const isLoading = isLoadingProfiles || isLoadingAccounts;
    const error = profilesError || accountsError;

    if (isLoading || error || !profiles || !accounts) {
      return { combinedUsers: [], isLoading, error };
    }

    const accountsMap = new Map<string, UserAccount>(accounts.map(acc => [acc.id, acc]));
    const combined = profiles.map(profile => ({
      ...profile,
      ...accountsMap.get(profile.id),
    }));

    return { combinedUsers: combined, isLoading: false, error: null };
  }, [profiles, accounts, isLoadingProfiles, isLoadingAccounts, profilesError, accountsError]);


  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    // Firestore timestamps can be tricky. They might be JS Date objects,
    // or Firestore Timestamp objects.
    if (date.toDate) {
      return format(date.toDate(), 'PPP');
    }
    if (typeof date === 'string') {
        try {
            return format(new Date(date), 'PPP')
        } catch {
            return 'Invalid Date';
        }
    }
    return 'Invalid Date';
  }


  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          User Management
        </h1>
        <p className="text-muted-foreground">
          A list of all users in Trivion Technology.
        </p>
      </header>

      {error && (
         <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Fetching Users</AlertTitle>
          <AlertDescription>
            There was a problem loading the user list. This may be due to a missing Firestore index. Please check the browser console or Firebase Emulator logs for an index creation link.
             <pre className="mt-2 text-xs bg-black/20 p-2 rounded-md overflow-x-auto">
              <code>{error.message}</code>
             </pre>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Registered Users</CardTitle>
          <CardDescription>
            {isLoading ? 'Loading user data...' : `Found ${combinedUsers?.length || 0} users.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-16" /></TableCell>
                  </TableRow>
                ))
              ) : combinedUsers.length > 0 ? (
                combinedUsers?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A'}</TableCell>
                    <TableCell>{user.email || 'Not Available'}</TableCell>
                    <TableCell>{formatDate(user.registrationDate)}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">View</Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                           <UserX className="w-8 h-8" />
                           <p>No users found.</p>
                        </div>
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

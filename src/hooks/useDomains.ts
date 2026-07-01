import { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { InternshipDomain } from '../types';
import { useStaticData } from '../contexts/StaticDataContext';

/**
 * Shared hook that merges hardcoded domains with Firestore-managed domains.
 * Firestore domains take priority when IDs overlap, so admin edits are respected.
 * Subscribes in real-time via onSnapshot so new domains appear instantly.
 */
export function useDomains(): InternshipDomain[] {
  const { domains: staticDomains } = useStaticData();
  const [firestoreDomains, setFirestoreDomains] = useState<InternshipDomain[]>([]);

  useEffect(() => {
    const domainsCol = collection(db, 'domains');
    const unsubscribe = onSnapshot(domainsCol, (snap) => {
      const domains: InternshipDomain[] = [];
      snap.forEach(d => domains.push({ id: d.id, ...d.data() } as InternshipDomain));
      setFirestoreDomains(domains);
    });
    return () => unsubscribe();
  }, []);

  const allDomains = useMemo(() => {
    const fsIds = firestoreDomains.map(d => d.id);
    const hardcoded = staticDomains.filter(d => !fsIds.includes(d.id));
    return [...firestoreDomains, ...hardcoded];
  }, [firestoreDomains, staticDomains]);

  return allDomains;
}

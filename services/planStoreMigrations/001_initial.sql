CREATE TABLE plans (
    plan_id_hash TEXT PRIMARY KEY
        CHECK (length(plan_id_hash) = 64),
    fingerprint TEXT NOT NULL
        CHECK (length(fingerprint) = 64),
    status TEXT NOT NULL
        CHECK (status IN (
            'ready',
            'executing',
            'completed',
            'failed',
            'partial',
            'interrupted',
            'expired',
            'cancelled'
        )),
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    confirmed_at TEXT,
    confirmed_by TEXT,
    claimed_at TEXT,
    claimed_by TEXT,
    started_at TEXT,
    finished_at TEXT,
    error_code TEXT,
    metadata_json TEXT NOT NULL
);

CREATE UNIQUE INDEX one_executing_plan
    ON plans (status)
    WHERE status = 'executing';

CREATE TABLE plan_operations (
    plan_id_hash TEXT NOT NULL,
    sequence INTEGER NOT NULL
        CHECK (sequence >= 0),
    operation_id TEXT NOT NULL,
    system TEXT NOT NULL,
    action TEXT NOT NULL,
    target_json TEXT NOT NULL,
    payload_hash TEXT NOT NULL
        CHECK (length(payload_hash) = 64),
    status TEXT NOT NULL
        CHECK (status IN (
            'pending',
            'in_progress',
            'succeeded',
            'failed',
            'unknown',
            'skipped'
        )),
    started_at TEXT,
    finished_at TEXT,
    external_reference TEXT,
    error_code TEXT,
    PRIMARY KEY (plan_id_hash, sequence),
    UNIQUE (plan_id_hash, operation_id),
    FOREIGN KEY (plan_id_hash)
        REFERENCES plans (plan_id_hash)
        ON DELETE CASCADE
);

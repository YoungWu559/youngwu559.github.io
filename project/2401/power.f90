PROGRAM power

IMPLICIT NONE

! Parameters for the program

INTEGER, PARAMETER :: param = 0 ! 0 --> u0 ; 1 --> utilda ; 2 --> theta
INTEGER, PARAMETER :: nobs = 2000
INTEGER, PARAMETER :: nrepli = 100
INTEGER, PARAMETER :: nparam = 2
INTEGER, PARAMETER :: nbootstrap = 100
REAL(8), PARAMETER :: param_lower = 1.5
REAL(8), PARAMETER :: param_upper = 3.5
REAL(8), PARAMETER :: param_incr = 0.02
REAL(8), PARAMETER :: q_chi_sq = 3.841459

! Parameters for the model

REAL(8), DIMENSION(5) :: zval = (/-2.0, -1.0, 0.0, 1.0, 2.0/)
REAL(8), DIMENSION(5) :: lambda_1 = (/1.0, 0.7, 0.7, 0.7, 1.0/)
REAL(8), DIMENSION(5) :: lambda_2 = (/1.0, 0.7, 0.7, 0.7, 1.0/)
REAL(8), DIMENSION(2) :: y = (/0.0, 1.0/)

INTEGER :: numz, numy, maxiter, iter, jmc, sa, sb, s0, alpha, beta, jvalue, n_param
REAL(8) :: u0, utilda, theta, cconv, criter, delta, var_delta
REAL(8), DIMENSION(SIZE(zval)) :: alpha1, alpha2, delta1, delta2
REAL(8), DIMENSION(SIZE(zval)) :: p_in, p_out, peq_1, peq_2, pnoeq_1, pnoeq_2
REAL(8), DIMENSION(nobs) :: zobs, obsy1, obsy2
REAL(8), DIMENSION(nobs) :: obsccp_eq1, obsccp_eq2, obsccp_noeq1, obsccp_noeq2
REAL(8), DIMENSION(INT(ABS(param_upper - param_lower) / ABS(param_incr)), 3) :: power

CALL RANDOM_SEED

u0 = 2.4
utilda = -3.0
theta = -0.5

n_param = INT(ABS(param_upper - param_lower) / ABS(param_incr))
IF (param == 0) THEN
    u0 = MIN(param_lower, param_upper)
ELSEIF (param == 1) THEN
    utilda = MIN(param_lower, param_upper)
ELSEIF (param == 2) THEN
    theta = MIN(param_lower, param_upper)
END IF

DO jvalue = 1, n_param

    IF (param == 0) THEN
        u0 = u0 + ABS(param_incr)
    ELSEIF (param == 1) THEN
        utilda = utilda + ABS(param_incr)
    ELSEIF (param == 2) THEN
        theta = theta + ABS(param_incr)
    END IF

    alpha = 0
    beta = 0

    numz = SIZE(zval)
    numy = SIZE(y)

    alpha1 = u0
    alpha2 = u0 + theta * zval
    delta1 = utilda
    delta2 = utilda

    cconv = 1.d-6
    criter = 1000
    maxiter = 1000
    p_in = 1.d-4
    iter = 1
    DO WHILE ((criter > cconv) .AND. (iter <= maxiter))
        p_out = comb_br2(alpha1, alpha2, delta1, delta2, p_in)
        criter = MAXVAL(ABS(p_out - p_in))
        p_in = p_out
        iter = iter + 1
    END DO
    peq_2 = p_out
    peq_1 = 1.0 / (1.0 + exp(- (alpha1 + delta1 * p_out)))

    cconv = 1.d-6
    criter = 1000
    maxiter = 1000
    p_in = 1.d-4
    iter = 1
    DO WHILE ((criter > cconv) .AND. (iter <= maxiter))
        p_out = comb_biased2(alpha1, alpha2, delta1, delta2, lambda_1, lambda_2, p_in)
        criter = MAXVAL(ABS(p_out - p_in))
        p_in = p_out
        iter = iter + 1
    END DO
    pnoeq_2 = p_out
    pnoeq_1 = 1.0 / (1.0 + exp(- (alpha1 + delta1 * (lambda_1 * p_out))))

    zobs = dotmulones(zval, nobs / numz)
    obsccp_eq1 = dotmulones(peq_1, nobs / numz)
    obsccp_eq2 = dotmulones(peq_2, nobs / numz)
    obsccp_noeq1 = dotmulones(pnoeq_1, nobs / numz)
    obsccp_noeq2 = dotmulones(pnoeq_2, nobs / numz)

    numz = SIZE(zval)
    
    s0 = 3
    sa = 1
    sb = 5

    DO jmc = 1, nrepli
        obsy1 = indicator(rndu(nobs) <= obsccp_eq1)
        obsy2 = indicator(rndu(nobs) <= obsccp_eq2)
        
        delta = com_delta(obsy1, obsy2, numz, sa, sb, s0)
        var_delta = com_var_delta (obsy1, obsy2, numz, sa, sb, s0, nbootstrap)
        
        IF (delta * delta / var_delta > q_chi_sq) alpha = alpha + 1
        
        obsy1 = indicator(rndu(nobs) <= obsccp_noeq1)
        obsy2 = indicator(rndu(nobs) <= obsccp_noeq2)
        
        delta = com_delta(obsy1, obsy2, numz, sa, sb, s0)
        var_delta = com_var_delta (obsy1, obsy2, numz, sa, sb, s0, nbootstrap)
        
        IF (delta * delta / var_delta > q_chi_sq) beta = beta + 1
    END DO
    
    IF (param == 0) THEN
        power(jvalue, 1) = u0
    ELSEIF (param == 1) THEN
        power(jvalue, 1) = utilda
    ELSEIF (param == 2) THEN
        power(jvalue, 1) = theta
    END IF
    power(jvalue, 2) = alpha * 1.0 / nrepli
    power(jvalue, 3) = beta * 1.0 / nrepli
    
    CALL prtv(power(jvalue, :))
    
END DO

IF (param == 0) THEN
    OPEN (30, FILE = 'u0_size_power.txt', STATUS = 'REPLACE')
    CALL wrtm(power, 30)
    CLOSE(30)
ELSEIF (param == 1) THEN
    OPEN (31, FILE = 'utilda_size_power.txt', STATUS = 'REPLACE')
    CALL wrtm(power, 31)
    CLOSE(31)
ELSEIF (param == 2) THEN
    OPEN (32, FILE = 'theta_size_power.txt', STATUS = 'REPLACE')
    CALL wrtm(power, 32)
    CLOSE(32)
END IF

WRITE(*, *) 'Done'

CONTAINS

! ---------- ---------- ---------- ---------- ----------
! Function for computing best response function with unbiased beliefs
! ---------- ---------- ---------- ---------- ----------

FUNCTION comb_br2 (alp_1, alp_2, del_1, del_2, beliefs2)

REAL(8), DIMENSION(:) :: alp_1, alp_2, del_1, del_2, beliefs2
REAL(8), DIMENSION(SIZE(alp_1)) :: comb_br2, best1, best2
best1 = alp_1 + del_1 * beliefs2
best1 = 1.0 / (1.0 + EXP(-best1))
best2 = alp_2 + del_2 * best1
best2 = 1.0 / (1.0 + EXP(-best2))

comb_br2 = best2

END FUNCTION comb_br2

! ---------- ---------- ---------- ---------- ----------
! Function for computing best response function with biased beliefs
! ---------- ---------- ---------- ---------- ----------

FUNCTION comb_biased2(alp_1, alp_2, del_1, del_2, lam_1, lam_2, beliefs2)

REAL(8), DIMENSION(:) :: alp_1, alp_2, del_1, del_2, lam_1, lam_2, beliefs2
REAL(8), DIMENSION(SIZE(alp_1)) :: comb_biased2, best1, best2

best1 = alp_1 + del_1 * (lam_1 * beliefs2)
best1 = 1.0 / (1.0 + EXP(-best1))
best2 = alp_2 + del_2 * (lam_2 * best1)
best2 = 1.0 / (1.0 + EXP(-best2))

comb_biased2 = best2

END FUNCTION comb_biased2

! ---------- ---------- ---------- ---------- ----------
! Function for computing the value of delta given the observations y1, y2
! y1, y2 binary choice observations for different markets
! n is the size of set Z
! a is the index of s(a) in the set Z
! b is the index of s(b) in the set Z
! x is the index of s(0) in the set Z
! ---------- ---------- ---------- ---------- ----------

FUNCTION com_delta (y1, y2, n, a, b, x)

INTEGER :: a, b, x, n, m
REAL(8), DIMENSION(:) :: y1, y2
REAL(8), DIMENSION(n) :: p1, p2, q1, q2
REAL(8) :: com_delta

m = SIZE(y1)
p1 = sumeveryn(y1, n) / (m / n)
p2 = sumeveryn(y2, n) / (m / n)
q1 = LOG(p1) - LOG(1.0 - p1)
q2 = LOG(p2) - LOG(1.0 - p2)
IF (q1(b) - q1(x) == 0.0 .OR. p2(b) - p2(x) == 0.0) THEN
    com_delta = 0.0
ELSE
    com_delta = (q1(a) - q1(x)) / (q1(b) - q1(x)) - (p2(a) - p2(x)) / (p2(b) - p2(x))
END IF

END FUNCTION

! ---------- ---------- ---------- ---------- ----------
! Function for computing the value of delta given the observations y1, y2
! y1, y2 binary choice observations for different markets
! n is the size of set Z
! a is the index of s(a) in the set Z
! b is the index of s(b) in the set Z
! x is the index of s(0) in the set Z
! n_rep is the number of resamples for the bootstrap
! ---------- ---------- ---------- ---------- ----------

FUNCTION com_var_delta (y1, y2, n, a, b, x, n_rep)

INTEGER :: a, b, x, n_rep, n, m, i, j
REAL(8) :: com_var_delta
REAL(8), DIMENSION(:) :: y1, y2
REAL(8), DIMENSION(SIZE(y1)) :: newy1, newy2
REAL(8), DIMENSION(n_rep) :: d
INTEGER, DIMENSION(SIZE(y1)) :: perm

m = INT(SIZE(y1) / n)
i = 1
DO WHILE (i <= n_rep)
    DO j = 1, n
        perm = permutation(m)
        newy1(((j - 1) * m + 1) : (j * m)) = sample(y1(((j - 1) * m + 1) : (j * m)), perm)
        newy2(((j - 1) * m + 1) : (j * m)) = sample(y2(((j - 1) * m + 1) : (j * m)), perm)     
    END DO
    d(i) = com_delta(newy1, newy2, n, a, b, x)
    IF (d(i) /= 0.0) i = i + 1
END DO
com_var_delta = var(d)

END FUNCTION com_var_delta

! ---------- ---------- ---------- ---------- ----------
! Function for computing the n-th moment given data x
! x - real vector
! n - integer
! ---------- ---------- ---------- ---------- ----------

FUNCTION moment (x, n)

INTEGER :: n, m, i
REAL(8) :: moment
REAL(8), DIMENSION(:) :: x

moment = 0.0
m = SIZE(x)
DO i = 1, m
    moment = moment + x(i) ** n
END DO
moment = moment / (m * 1.0)

END FUNCTION moment

! ---------- ---------- ---------- ---------- ----------
! Function for mean given data x
! x - real vector
! ---------- ---------- ---------- ---------- ----------

FUNCTION mean (x)

REAL(8) :: mean
REAL(8), DIMENSION(:) :: x

mean = moment(x, 1)

END FUNCTION mean

! ---------- ---------- ---------- ---------- ----------
! Function for computing the variance given data x
! x - real vector
! ---------- ---------- ---------- ---------- ----------

FUNCTION var (x)

INTEGER :: n
REAL(8) :: var, m
REAL(8), DIMENSION(:) :: x

n = SIZE(x)
m = moment(x, 1)
var = (moment(x, 2) - (m * m)) * n / (n - 1)

END FUNCTION var

! ---------- ---------- ---------- ---------- ----------
! Function for generating a vector of 1s with length n
! n - integer
! ---------- ---------- ---------- ---------- ----------

FUNCTION ones (n)

INTEGER :: n
REAL(8), DIMENSION(n) :: ones

ones = 1.0

END FUNCTION ones

! ---------- ---------- ---------- ---------- ----------
! Function for generating an m x n matrix of 0s
! n, m - integer
! ---------- ---------- ---------- ---------- ----------

FUNCTION zeros (n, m)

INTEGER :: n, m
REAL(8), DIMENSION(n, m) :: zeros

zeros = 0.0

END FUNCTION zeros

! ---------- ---------- ---------- ---------- ----------
! Function for generating an inducator vector
! True ==> 1, False ==> 0
! x - logical vector
! ---------- ---------- ---------- ---------- ----------

FUNCTION indicator (x)

INTEGER :: n, i
LOGICAL, DIMENSION(:) :: x
REAL(8), DIMENSION(SIZE(x)) :: indicator

n = SIZE(x)
DO i = 1, n
    IF (x(i)) THEN
        indicator(i) = 1.0;
    ELSE
        indicator(i) = 0.0;
    END IF
END DO

END FUNCTION indicator

! ---------- ---------- ---------- ---------- ----------
! Function for .*. ones(n), i.e. repeat vector v n times
! v - real vector
! n - integer
! ---------- ---------- ---------- ---------- ----------

FUNCTION dotmulones (v, n)

INTEGER :: n, m, i
REAL(8), DIMENSION(:) :: v
REAL(8), DIMENSION(n * SIZE(v)) :: dotmulones

m = SIZE(v)
DO i = 1, m
    dotmulones(((i - 1) * n + 1):(i * n)) = v(i)
END DO

END FUNCTION dotmulones

! ---------- ---------- ---------- ---------- ----------
! Function for summing a vector every n element at a time
! x - real matrix
! n - integer
! ---------- ---------- ---------- ---------- ----------

FUNCTION sumeveryn (x, n)

INTEGER :: n, m, i
REAL(8), DIMENSION(:) :: x
REAL(8), DIMENSION(n) :: sumeveryn

m = INT(SIZE(x) / n)
DO i = 1, n
    sumeveryn(i) = SUM(x(((i - 1) * m + 1) : i * m))
END DO

END FUNCTION sumeveryn

! ---------- ---------- ---------- ---------- ----------
! Function for generating n uniformly distributed variables
! rndu ~ unif(0, 1)
! n - integer
! ---------- ---------- ---------- ---------- ----------

FUNCTION rndu (n)

INTEGER :: n, i
REAL(8), DIMENSION(n) :: rndu

DO i = 1, n
    CALL RANDOM_NUMBER(rndu(i))
END DO

END FUNCTION rndu

! ---------- ---------- ---------- ---------- ----------
! Function for sampling from a vector x using index ind
! ind - integer vector
! x - real vector
! ---------- ---------- ---------- ---------- ----------

FUNCTION sample (x, ind)

INTEGER :: n, i
INTEGER, DIMENSION(:) :: ind
REAL(8), DIMENSION(:) :: x
REAL(8), DIMENSION(SIZE(x)) :: sample

n = SIZE(x)
DO i = 1, n
    sample(i) = x(ind(i))
END DO

END FUNCTION sample

! ---------- ---------- ---------- ---------- ----------
! Function for finding an index of sample with replacement
! Note this is NOT permutation
! n - integer
! ---------- ---------- ---------- ---------- ----------

FUNCTION permutation (n)

INTEGER :: n, i
INTEGER, DIMENSION(n) :: permutation
REAL(8) :: r

DO i = 1, n
    CALL RANDOM_NUMBER(r)
    permutation(i) = INT(r * n + 1)
END DO

END FUNCTION permutation

! ---------- ---------- ---------- ---------- ----------
! Function for printing matrix x
! x - real matrix
! ---------- ---------- ---------- ---------- ----------

SUBROUTINE prtm (x)

REAL(8), DIMENSION(:, :), INTENT(IN) :: x

INTEGER :: n, m, i, j

n = SIZE(x, 1)
m = SIZE(x, 2)

DO i = 1, n
    DO j = 1, m
        WRITE(*, '(F10.5)', ADVANCE = 'no') x(i, j)
    END DO
    WRITE(*, *) ''
END DO

END SUBROUTINE prtm

! ---------- ---------- ---------- ---------- ----------
! Function for printing vector x
! x - real vector
! ---------- ---------- ---------- ---------- ----------

SUBROUTINE prtv (x)

REAL(8), DIMENSION(:), INTENT(IN) :: x

INTEGER :: n, i

n = SIZE(x)

DO i = 1, n
    WRITE(*, '(F10.5)', ADVANCE = 'no') x(i)
END DO
WRITE(*, *)

END SUBROUTINE prtv

! ---------- ---------- ---------- ---------- ----------
! Function for printing vector x to file
! x - real vector
! n - integer
! ---------- ---------- ---------- ---------- ----------

SUBROUTINE wrtv (x, n)

INTEGER :: n, m, i
REAL(8), DIMENSION(:), INTENT(IN) :: x

m = SIZE(x)
DO i = 1, m
    WRITE(n, '(F10.5)', ADVANCE = 'no') x(i)
END DO
WRITE(m, *)

END SUBROUTINE wrtv

! ---------- ---------- ---------- ---------- ----------
! Function for printing matrix x to file
! x - real matrix
! n - integer
! ---------- ---------- ---------- ---------- ----------

SUBROUTINE wrtm (x, n)

INTEGER :: n, m, l, i, j
REAL(8), DIMENSION(:, :), INTENT(IN) :: x

m = SIZE(x, 1)
l = SIZE(x, 2)

DO i = 1, m
    DO j = 1, l
        WRITE(n, '(F10.5)', ADVANCE = 'no') x(i, j)
    END DO
    WRITE(n, *) ''
END DO

END SUBROUTINE wrtm

END PROGRAM power
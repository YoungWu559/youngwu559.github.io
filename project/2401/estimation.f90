PROGRAM estimation

IMPLICIT NONE

! Parameters for the program

INTEGER, PARAMETER :: nobs = 2000
INTEGER, PARAMETER :: nrepli = 1000
INTEGER, PARAMETER :: nparam = 2

! Parameters for the model

REAL(8), DIMENSION(5) :: zval = (/-2.0, -1.0, 0.0, 1.0, 2.0/)
REAL(8), DIMENSION(5) :: lambda_1 = (/1.0, 0.7, 0.7, 0.7, 1.0/)
REAL(8), DIMENSION(5) :: lambda_2 = (/1.0, 0.7, 0.7, 0.7, 1.0/)
REAL(8), DIMENSION(2) :: y = (/0.0, 1.0/)

INTEGER :: numz, numy, maxiter, iter, jmc
REAL(8) :: u0, utilda, theta, profit1_0, profit1_1, cconv, criter
REAL(8), DIMENSION(SIZE(zval)) :: profit2_0, profit2_1, alpha1, alpha2, delta1, delta2
REAL(8), DIMENSION(SIZE(zval)) :: p_in, p_out, peq_1, peq_2, pnoeq_1, pnoeq_2, truebelief_2
REAL(8), DIMENSION(nparam) :: trueparam, best
REAL(8), DIMENSION(nparam, nparam) :: varest
REAL(8), DIMENSION(nrepli, nparam) :: estparam_noer, estparam_er
REAL(8), DIMENSION(nrepli, SIZE(zval)) :: estbelief_noer, estbelief_er
REAL(8), DIMENSION(nobs) :: yobs, zobs, obsccp1, obsccp2, obsy1, obsy2, obsbel_noer, obsbel_er
REAL(8), DIMENSION(SIZE(zval)) :: estbel_noer, estbel_er, estccp1, estccp2, estq1, estq2
REAL(8), DIMENSION(nobs, nparam * SIZE(y)) :: xobs
REAL(8), DIMENSION(nobs, SIZE(y)) :: restobs
CHARACTER, DIMENSION(nparam) :: namesparam

CALL RANDOM_SEED

u0 = 2.4
utilda = -3.0
theta = -0.5

numz = SIZE(zval)
numy = SIZE(y)

profit1_0 = u0
profit1_1 = u0 + utilda
profit2_0 = u0 + theta * zval
profit2_1 = u0 + theta * zval + utilda

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

trueparam = (/u0, utilda/)
namesparam = (/'0', '1'/)
estparam_noer = 0.0
estparam_er = 0.0

truebelief_2 = lambda_1 * pnoeq_2
estbelief_noer = 0.0
estbelief_er = 0.0

zobs = dotmulones(zval, nobs / numz)
obsccp1 = dotmulones(pnoeq_1, nobs / numz)
obsccp2 = dotmulones(pnoeq_2, nobs / numz)

numz = SIZE(zval)

DO jmc = 1, nrepli
    obsy1 = indicator(rndu(nobs) <= obsccp1)
    obsy2 = indicator(rndu(nobs) <= obsccp2)
    
    estccp1 = sumeveryn(obsy1, numz) / (nobs / numz)
    estccp2 = sumeveryn(obsy2, numz) / (nobs / numz)
    
    estq1 = LOG(estccp1) - LOG(1.0 - estccp1)
    estq2 = LOG(estccp2) - LOG(1.0 - estccp2)
    
    estbel_noer = estccp2(1) + (estccp2(numz) - estccp2(1)) * (estq1 - estq1(1)) / (estq1(numz) - estq1(1))
    obsbel_noer = dotmulones(estbel_noer, nobs / numz)
    
    yobs = obsy1 + 1
    xobs(:, 1:nparam) = 0.0
    xobs(:, nparam + 1) = 1.0
    xobs(:, nparam + 2) = obsbel_noer
    restobs = 0.0
    
    CALL clogit(yobs, xobs, restobs, namesparam, best, varest)
    estparam_noer(jmc, :) = best
    estbelief_noer(jmc, :) = estbel_noer
    
    estbel_er = estccp2
    obsbel_er = dotmulones(estbel_er, nobs/numz)
    xobs(:, nparam + 2) = obsbel_er
    CALL clogit(yobs, xobs, restobs, namesparam, best, varest)
    estparam_er(jmc, :) = best
    estbelief_er(jmc, :) = estbel_er
    
    WRITE(*, *) jmc
END DO

OPEN (10, FILE = 'estparam_er.txt', STATUS = 'REPLACE')
OPEN (11, FILE = 'estparam_noer.txt', STATUS = 'REPLACE')
OPEN (12, FILE = 'estbelief_er.txt', STATUS = 'REPLACE')
OPEN (13, FILE = 'estbelief_noer.txt', STATUS = 'REPLACE')
CALL wrtm(estparam_er, 10)
CALL wrtm(estparam_noer, 11)
CALL wrtm(estbelief_er, 12)
CALL wrtm(estbelief_noer, 13)
CLOSE(10)
CLOSE(11)
CLOSE(12)
CLOSE(13)

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
! Subroutine for logit estimation
! Algorithm by Victor Aguirregabiria
!
! ydum - [nobs] vector of reals, input
! x - [nobs x (k * nalt)] matrix of reals, input
! restx - [nobs x nalt] matrix of reals, input
! namesb - [k] vector of characters, input
! best - [k] vector of reals, output
! varest - [k x k] matrix of reals, output
! ---------- ---------- ---------- ---------- ----------

SUBROUTINE clogit (ydum, x, restx, namesb, best, varest)

CHARACTER, DIMENSION(:), INTENT(IN) :: namesb
REAL(8), DIMENSION(:), INTENT(IN) :: ydum
REAL(8), DIMENSION(:, :), INTENT(IN) :: x, restx
REAL(8), DIMENSION(SIZE(namesb)), INTENT(OUT) :: best
REAL(8), DIMENSION(SIZE(namesb), SIZE(namesb)), INTENT(OUT) :: varest

INTEGER :: nobs, nalt, npar, j, iter
REAL(8) :: cconvb, myzero, criter, llike
REAL(8), DIMENSION(SIZE(namesb)) :: b0, b1, xysum, d1llike
REAL(8), DIMENSION(SIZE(namesb), SIZE(namesb)) :: xxm, d2llike
REAL(8), DIMENSION(SIZE(ydum), SIZE(namesb)) :: xbuff, sumpx
REAL(8), DIMENSION(SIZE(ydum), INT(MAXVAL(ydum))) :: phat

cconvb = 1.d-6
myzero = 1.d-16
nobs = SIZE(ydum)
nalt = INT(MAXVAL(ydum))
npar = SIZE(x, 2) / nalt
IF (npar /= SIZE(namesb)) THEN
    WRITE (*, *) 'ERROR'
    RETURN
END IF

xysum = 0.0
DO j = 1, nalt
    xysum = xysum + sumc(dotmul(x(:, (npar * (j - 1) + 1) : (npar * j)), indicator(ydum == j)))
END DO

iter = 1
criter = 1000
llike = -nobs
b0 = 1.0

DO WHILE (criter > cconvb)
    phat = 0.0
    DO j = 1, nalt
        phat(:, j) = MATMUL(x(:, (npar * (j - 1) + 1) : (npar * j)), b0) + restx(:, j)
    END DO
    phat = dotsub(phat, maxc(TRANSPOSE(phat)))
    phat = dotdiv(EXP(phat), sumc(EXP(TRANSPOSE(phat))))

    sumpx = 0.0
    xxm = 0.0
    llike = 0.0
    DO j = 1, nalt
        xbuff = x(:, (npar * (j - 1) + 1) : (npar * j))
        sumpx = sumpx + dotmul(xbuff, phat(:, j))
        xxm = xxm + MATMUL(TRANSPOSE(dotmul(xbuff, phat(:, j))), xbuff)
        llike = llike + SUM(indicator(ydum == j) * LOG(MAX(phat(:, j), myzero)))
    END DO

    d1llike = xysum - sumc(sumpx)
    d2llike = - (xxm - MATMUL(TRANSPOSE(sumpx), sumpx))
    b1 = b0 - MATMUL(inv(d2llike), d1llike)
    criter = SQRT(DOT_PRODUCT((b1 - b0), (b1 - b0)))
    b0 = b1
    iter = iter + 1
END DO

best = b0
varest = inv(-d2llike)

END SUBROUTINE clogit

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
! Function for element-wise addition of a matrix x and a vector v
! add v to each column of x
! x - real matrix
! v - real vector
! ---------- ---------- ---------- ---------- ----------

FUNCTION dotadd (x, v)

REAL(8), DIMENSION(:) :: v
REAL(8), DIMENSION(:, :) :: x
REAL(8), DIMENSION(SIZE(x, 1), SIZE(x, 2)) :: dotadd

INTEGER :: m, i

m = SIZE(x, 2)

DO i = 1, m
    dotadd(:, i) = x(:, i) + v
END DO

END FUNCTION dotadd

! ---------- ---------- ---------- ---------- ----------
! Function for element-wise subtraction of a matrix x and a vector v
! subtract v from each column of x
! x - real matrix
! v - real vector
! ---------- ---------- ---------- ---------- ----------

FUNCTION dotsub (x, v)

REAL(8), DIMENSION(:) :: v
REAL(8), DIMENSION(:, :) :: x
REAL(8), DIMENSION(SIZE(x, 1), SIZE(x, 2)) :: dotsub

INTEGER :: m, i

m = SIZE(x, 2)

DO i = 1, m
    dotsub(:, i) = x(:, i) + v
END DO

END FUNCTION dotsub

! ---------- ---------- ---------- ---------- ----------
! Function for element-wise multiplication of a matrix x and a vector v
! multiply v by each column of x
! x - real matrix
! v - real vector
! ---------- ---------- ---------- ---------- ----------

FUNCTION dotmul (x, v)

REAL(8), DIMENSION(:) :: v
REAL(8), DIMENSION(:, :) :: x
REAL(8), DIMENSION(SIZE(x, 1), SIZE(x, 2)) :: dotmul

INTEGER :: m, i

m = SIZE(x, 2)

DO i = 1, m
    dotmul(:, i) = x(:, i) * v
END DO

END FUNCTION dotmul

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
! Function for element-wise division of a matrix x and a vector v
! divide v from each column of x
! x - real matrix
! v - real vector
! ---------- ---------- ---------- ---------- ----------

FUNCTION dotdiv (x, v)

REAL(8), DIMENSION(:) :: v
REAL(8), DIMENSION(:, :) :: x
REAL(8), DIMENSION(SIZE(x, 1), SIZE(x, 2)) :: dotdiv

INTEGER :: m, i

m = SIZE(x, 2)

DO i = 1, m
    dotdiv(:, i) = x(:, i) / v
END DO

END FUNCTION dotdiv

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
! Function for generating 1 normally distributed variable
! normal ~ normal(0, 1)
! ---------- ---------- ---------- ---------- ----------

FUNCTION normal ()

REAL(8) :: normal

REAL(8) :: u, v

CALL RANDOM_NUMBER(u)
CALL RANDOM_NUMBER(v)

normal = SQRT(-2.0 * LOG(u)) * COS(2 * 3.141592653589 * v)

END FUNCTION normal

! ---------- ---------- ---------- ---------- ----------
! Function for generating n x m normally distributed variables
! rndn(:, m) ~ normal(mean(m), sd(m))
! n, m - integer
! mean, sd - real vector of size m
! ---------- ---------- ---------- ---------- ----------

FUNCTION rndn (n, m, mean, sd)

INTEGER :: n, m, i, j
REAL(8), DIMENSION(n, m) :: rndn
REAL(8), DIMENSION(m) :: mean, sd

DO i = 1, n
    DO j = 1, m
        rndn(i, j) = mean(j) + sd(j) * normal()
    END DO
END DO

END FUNCTION rndn

! ---------- ---------- ---------- ---------- ----------
! Function for summing a matrix by column
! x - real matrix
! ---------- ---------- ---------- ---------- ----------

FUNCTION sumc (x)

INTEGER :: n, i
REAL(8), DIMENSION(:, :) :: x
REAL(8), DIMENSION(SIZE(x, 2)) :: sumc

n = SIZE(x, 2)
DO i = 1, n
    sumc(i) = SUM(x(:, i))
END DO

END FUNCTION sumc

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
! Function for finding the maximum of a matrix by column
! x - real matrix
! ---------- ---------- ---------- ---------- ----------

FUNCTION maxc (x)

INTEGER :: n, i
REAL(8), DIMENSION(:, :) :: x
REAL(8), DIMENSION(SIZE(x, 2)) :: maxc

n = SIZE(x, 2)
DO i = 1, n
    maxc(i) = MAXVAL(x(:, i))
END DO

END FUNCTION maxc

! ---------- ---------- ---------- ---------- ----------
! Function for finding the argmax of a matrix by column
! x - real matrix
! ---------- ---------- ---------- ---------- ----------

! ---------- ---------- ---------- ---------- ----------
! Function for inverting a matrix
! x - real matrix
! ---------- ---------- ---------- ---------- ----------

FUNCTION inv (x)

REAL(8), DIMENSION(:, :) :: x
REAL(8), DIMENSION(SIZE(x, 1), SIZE(x, 2)) :: inv
REAL(8) :: det

IF (SIZE(x, 1) == 2) THEN
    det = x(1, 1) * x(2, 2) - x(1, 2) * x(2, 1)
    IF (det == 0.0) THEN
        WRITE(*, *) 'Not Invertible'
        RETURN
    END IF
    inv(1, 1) = x(2, 2) / det
    inv(1, 2) = -x(1, 2) / det
    inv(2, 1) = -x(2, 1) / det
    inv(2, 2) = x(1, 1) / det
    RETURN
ELSE
    inv = solve(x, eye(SIZE(x, 1)))
END IF

END FUNCTION inv

! ---------- ---------- ---------- ---------- ----------
! Function for solving x from a x = b
! a, b - real matrix
! ---------- ---------- ---------- ---------- ----------

FUNCTION solve (a, b)

REAL(8), DIMENSION(:, :) :: a, b
REAL(8), DIMENSION(SIZE(b, 1), SIZE(b, 2)) :: solve

INTEGER :: na, ma, nb, mb
REAL(8), DIMENSION(SIZE(a, 1), SIZE(a, 2) + SIZE(b, 2)) :: d

na = SIZE(a, 1)
ma = SIZE(a, 2)
nb = SIZE(b, 1)
mb = SIZE(b, 2)

IF (na /= nb) THEN
    WRITE (*, *) 'Incompatible'
    RETURN
END IF

d(:, 1:ma) = a
d(:, (ma + 1):(ma + mb)) = b
CALL rref(d)
solve = d(:, (ma + 1):(ma + mb))

END FUNCTION solve

! ---------- ---------- ---------- ---------- ----------
! Subroutine for finding the rref of a matrix
! x - real matrix
! ---------- ---------- ---------- ---------- ----------

SUBROUTINE rref (x)

REAL(8), DIMENSION(:, :), INTENT(INOUT) :: x

INTEGER :: n, m, i, j, k, l
REAL(8) :: temp

n = SIZE(x, 1)
m = SIZE(x, 2)
IF (n > m) THEN
    WRITE (*, *) 'Not Invertable'
    x = 0.0
    RETURN
END IF

DO i = 1, n
    IF (x(i, i) == 0) THEN
        DO j = i + 1, n
            IF(x(j, i) /= 0) THEN
                DO k = i, m
                    temp = x(j, k)
                    x(j, k) = x(i, k)
                    x(i, k) = temp
                END DO
                EXIT
            END IF
        END DO
    END IF
    IF (x(i, i) == 0) THEN
        WRITE (*, *) 'Not Invertable'
        x = 0.0
        RETURN
    END IF
    DO j = i + 1, m
        x(i, j) = x(i, j) / x(i, i)
    END DO
    x(i, i) = 1.0
    DO k = i + 1, n
        DO l = i + 1, m
            x(k, l) = x(k, l) - x(k, i) * x(i, l)
        END DO
        x(k, i) = 0.0
    END DO
END DO

DO i = n, 1, -1
    DO j = i - 1, 1, -1
        DO k = i + 1, m
            x(j, k) = x(j, k) - x(j, i) * x(i, k)
        END DO
        x(j, i) = 0
    END DO
END DO

END SUBROUTINE rref

! ---------- ---------- ---------- ---------- ----------
! Function for extracting the diagonal elements
! x - real matrix
! ---------- ---------- ---------- ---------- ----------

FUNCTION diag (x)

REAL(8), DIMENSION(:, :) :: x
REAL(8), DIMENSION(SIZE(x, 1)) :: diag

INTEGER :: n, i

n = SIZE(x, 1)

DO i = 1, n
    diag(i) = x(i, i)
END DO

END FUNCTION diag

! ---------- ---------- ---------- ---------- ----------
! Function for constructing the identity matrix of size n
! n - integer
! ---------- ---------- ---------- ---------- ----------

FUNCTION eye (n)

INTEGER :: n, i
REAL(8), DIMENSION(n, n) :: eye

eye = 0.

DO i = 1, n
    eye(i, i) = 1.0
END DO

END FUNCTION eye

! ---------- ---------- ---------- ---------- ----------
! Function for constructing a sequence
! the vector starts at *start*, step by *interval*, with size *length*
! integer - start, interval, length
! ---------- ---------- ---------- ---------- ----------

FUNCTION seqa (start, interval, length)

INTEGER :: start, interval, length, i
INTEGER, DIMENSION(length) :: seqa

DO i = 1, length
    seqa(i) = start + interval * i
END DO

END FUNCTION seqa

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

END PROGRAM estimation